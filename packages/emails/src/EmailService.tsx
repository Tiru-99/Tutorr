// =========================================
// File: emails/EmailService.tsx
// =========================================
import * as React from "react";
import { render, renderAsync } from "@react-email/render";
import { Resend } from "resend";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import InstantBookingConfirmation from "../templates/InstantBookingConfirmation";
import OneHourBeforeReminder from "../templates/OneHourBeforeReminder";
import OnTimeReminder from "../templates/OnTimeReminder";
import CancellationNotification from "../templates/CancellationNotfication";

dotenv.config({ path: '../../.env' })
// ===== Types =====
export type NotificationType =
  | "instant"
  | "one-hour-before"
  | "on-time"
  | "cancel-booking";

export interface NotificationData {
  to: string | string[];
  studentName: string;
  teacherName: string;
  meetingTime: string | Date;
  meetingLink: string;
  bookingId: string;
  cancelledBy?: "STUDENT" | "TEACHER" | "SYSTEM";
  from?: string; // fallback to env default
  locale?: string; // date/time formatting locale
}

export interface SendEmailResponse {
  id?: string;
  status?: string;
  error?: unknown;
}

const SUBJECTS: Record<NotificationType, string> = {
  instant: "Booking Confirmed 🎉",
  "one-hour-before": "Meeting Reminder ⏰",
  "on-time": "Meeting Starting Now 🚀",
  "cancel-booking": "Booking Cancelled ❌",
};

function getTemplate(
  type: NotificationType,
  data: NotificationData
): React.ReactElement {
  const common = {
    studentName: data.studentName,
    teacherName: data.teacherName,
    meetingTime: data.meetingTime,
    meetingLink: data.meetingLink,
    bookingId: data.bookingId,
  } as const;

  switch (type) {
    case "instant":
      return <InstantBookingConfirmation {...common} />;
    case "one-hour-before":
      return <OneHourBeforeReminder {...common} />;
    case "on-time":
      return <OnTimeReminder {...common} />;
    case "cancel-booking":
      return (
        <CancellationNotification
          {...common}
          cancelledBy={data.cancelledBy ?? "SYSTEM"}
        />
      );
  }
}

// Try to use `render` if available (sync), otherwise fallback to `renderAsync`
async function renderHtml(element: React.ReactElement) {
  if (typeof render === "function") {
    try {
      return render(element, { pretty: true });
    } catch {
      // fall back in case render is async in your version
      return await renderAsync(element, { pretty: true });
    }
  }
  return await renderAsync(element, { pretty: true });
}
const transporter = nodemailer.createTransport({
  service: "gmail", // Using Gmail as the service, but you can change it to others (e.g., SendGrid)
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address from .env
    pass: process.env.GMAIL_PASS, // Your Gmail app password from .env
  },
});



export async function sendEmail(
  type: NotificationType,
  data: NotificationData
): Promise<SendEmailResponse[]> {
  const results: SendEmailResponse[] = [];

  // If data.to is an array, send individually
  const recipients = Array.isArray(data.to) ? data.to : [data.to];

  for (const recipient of recipients) {
    // Generate HTML for each recipient (optional: personalize)
    const element = getTemplate(type, {
      ...data,
      to: recipient, // pass current recipient to template if needed
    });
    const html = await renderHtml(element);

    try {
      const info = await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: recipient,
        subject: SUBJECTS[type],
        html,
      });

      console.log(`Email sent to ${recipient}:`, info.messageId);
      results.push({ id: info.messageId, status: "sent" });
    } catch (error) {
      console.error(`Email failed for ${recipient}:`, error);
      results.push({ status: "error", error });
    }
  }

  return results;
}
// Helper to render without sending (useful for previews and tests)
export async function renderEmailHtml(
  type: NotificationType,
  data: NotificationData
) {
  const element = getTemplate(type, data);
  return await renderHtml(element);
}
