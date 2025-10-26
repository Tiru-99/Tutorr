// =========================================
// File: emails/EmailService.tsx
// =========================================
import * as React from "react";
import { render, renderAsync } from "@react-email/render";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import InstantBookingConfirmation from "./templates/InstantBookingConfirmation";
import OneHourBeforeReminder from "./templates/OneHourBeforeReminder";
import OnTimeReminder from "./templates/OnTimeReminder";
import CancellationNotification from "./templates/CancellationNotfication";

dotenv.config({ path: "../../.env" });

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
  studentEmail: string;
  teacherEmail: string;
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
  data: NotificationData & { recipientRole: "STUDENT" | "TEACHER" }
): React.ReactElement {
  const common = {
    studentName: data.studentName,
    teacherName: data.teacherName,
    meetingTime: data.meetingTime,
    meetingLink: data.meetingLink,
    bookingId: data.bookingId,
    recipientRole: data.recipientRole, // ✅ pass it down
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

// Handle sync vs async render
async function renderHtml(element: React.ReactElement) {
  try {
    return render(element, { pretty: true });
  } catch {
    return await renderAsync(element, { pretty: true });
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendEmail(
  type: NotificationType,
  data: NotificationData
): Promise<SendEmailResponse[]> {
  const results: SendEmailResponse[] = [];

  const recipients = Array.isArray(data.to) ? data.to : [data.to];

  for (const recipient of recipients) {
    // ✅ Determine role based on matching emails
    const role: "STUDENT" | "TEACHER" =
      recipient === data.studentEmail ? "STUDENT" : "TEACHER";

    const element = getTemplate(type, {
      ...data,
      recipientRole: role,
    });

    const html = await renderHtml(element);

    const res = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: SUBJECTS[type],
      html,
    });

    results.push({ id: res.messageId, status: "sent" });
  }

  return results;
}

// Helper to render without sending
export async function renderEmailHtml(
  type: NotificationType,
  data: NotificationData & { recipientRole: "STUDENT" | "TEACHER" }
) {
  const element = getTemplate(type, data);
  return await renderHtml(element);
}
