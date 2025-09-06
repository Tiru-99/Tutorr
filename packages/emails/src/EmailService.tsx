// =========================================
// File: emails/EmailService.tsx
// =========================================
import * as React from "react";
import { render, renderAsync } from "@react-email/render";
import { Resend } from "resend";

import InstantBookingConfirmation from "../templates/InstantBookingConfirmation";
import OneHourBeforeReminder from "../templates/OneHourBeforeReminder";
import OnTimeReminder from "../templates/OnTimeReminder";
import CancellationNotification from "../templates/CancellationNotfication";

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

export async function sendEmail(
  type: NotificationType,
  data: NotificationData
): Promise<SendEmailResponse> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const element = getTemplate(type, data);
  const html = await renderHtml(element);

  const from =
    data.from ?? process.env.RESEND_FROM_EMAIL ?? "noreply@yourdomain.com";

  try {
    const result = await resend.emails.send({
      from,
      to: data.to,
      subject: SUBJECTS[type],
      html,
    });

    return { id: (result as any)?.id, status: "sent" };
  } catch (error) {
    return { status: "error", error };
  }
}

// Helper to render without sending (useful for previews and tests)
export async function renderEmailHtml(
  type: NotificationType,
  data: NotificationData
) {
  const element = getTemplate(type, data);
  return await renderHtml(element);
}
