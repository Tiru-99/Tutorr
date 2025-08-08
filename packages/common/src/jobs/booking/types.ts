
export interface BookingJobData {
    studentId: string;
    teacherId: string;
    slotId: string;
    price: number;
    date : string ; 
    request_id: string;
    jobType: 'attempt-booking' | 'create-booking' | 'cancel-booking';
}

export interface BookingAttemptData extends BookingJobData {
    jobType: 'attempt-booking';
    timestamp: number;
}

export interface BookingCreationData extends BookingJobData {
    jobType: 'create-booking';
    fencingToken: number;
    orderId: string;
    amount : string ; 
    paymentId: string;
}

export interface BookingResult {
    success: boolean;
    orderId?: string;
    bookingId?: string;
    reason?: string;
}