import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";
import { razorpay } from "@tutorr/common";
import { NotificationQueue } from "@tutorr/common";
import redis from "@tutorr/common";

export async function POST(req: NextRequest) {
    const { bookingId, reason } = await req.json();
    const studentId = req.headers.get("x-student-id");

    if (!bookingId) {
        return NextResponse.json({
            error: "Booking ID is required"
        }, { status: 400 });
    }

    if (!studentId) {
        return NextResponse.json({
            error: "Unauthorized"
        }, { status: 401 });
    }

    try {
        // Database operations in transaction
        const dbResult = await prisma.$transaction(async (tx: any) => {
            // Find booking
            const booking = await tx.booking.findFirst({
                where: {
                    id: bookingId,
                    studentId
                }
            });

            if (!booking) {
                throw new Error("Booking not found");
            }

            if (booking.status === 'CANCELLED') {
                throw new Error("Booking already cancelled");
            }

            if (booking.status === 'SUCCESS') {
                throw new Error("Cannot cancel completed booking");
            }

            // Update booking to cancelled
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    status: "CANCELLED",
                    cancellationBy: "STUDENT",
                    cancelledAt: new Date(),
                    cancellationReason: reason
                }
            });

            if (!booking.startTime || !booking.endTime) {
                throw new Error("No start time or end Time found in the booking")
            }

            // Free up the availability slot
            const availability = await tx.availability.findFirst({
                where: {
                    teacherId: booking.teacherId,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    status: "BOOKED"
                }
            });

            if (availability) {
                await tx.availability.delete({
                    where: { id: availability.id }
                });
            }

            // Create refund transaction if payment was made
            if (booking.payment_id && booking.amount) {
                const wallet = await tx.wallet.findFirst({
                    where: { teacherId: booking.teacherId }
                });

                if (wallet) {
                    const originalAmount = parseFloat(booking.amount.toString());
                    const refundAmount = originalAmount * 0.95; // 95% refund for student cancellation

                    await tx.transactions.create({
                        data: {
                            studentId,
                            teacherId: booking.teacherId,
                            type: "REFUND",
                            walletId: wallet.id,
                            bookingId: booking.id,
                            amount: -refundAmount // Negative because money leaves teacher's wallet
                        }
                    });

                    const notificationQueue = new NotificationQueue(redis);
                    notificationQueue.cancelBookingNotification({
                        bookingId: booking.id,
                        jobType: "cancel-booking",
                    })

                    return {
                        updatedBooking,
                        refundAmount,
                        paymentId: booking.payment_id
                    };
                }
            }



            return { updatedBooking, refundAmount: 0, paymentId: null };
        });

        // Process Razorpay refund after database transaction
        let razorpayRefund = null;
        if (dbResult.refundAmount > 0 && dbResult.paymentId) {
            razorpayRefund = await processRazorpayRefund(
                dbResult.paymentId,
                dbResult.refundAmount,
                bookingId
            );
        }

        return NextResponse.json({
            message: "Booking cancelled successfully",
            refund: {
                amount: dbResult.refundAmount,
                processed: razorpayRefund?.success || false,
                razorpayRefundId: razorpayRefund?.refundId
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Cancellation error:", error);

        return NextResponse.json({
            error: error instanceof Error ? error.message : "Cancellation failed"
        }, { status: 400 });
    }
}


// Process Razorpay refund
const processRazorpayRefund = async (paymentId: string, refundAmount: number, bookingId: string) => {
    try {
        const refund = await razorpay.payments.refund(paymentId, {
            amount: Math.round(refundAmount * 100), // Convert to cents
            speed: "normal",
            notes: {
                booking_id: bookingId,
                reason: "booking_cancellation"
            }
        });

        return {
            success: true,
            refundId: refund.id,
            amount: refund.amount! / 100 // Convert back to dollars
        };
    } catch (error: any) {
        console.error('Razorpay refund failed:', error);
        return {
            success: false,
            error: error.error?.description || 'Refund failed'
        };
    }
};