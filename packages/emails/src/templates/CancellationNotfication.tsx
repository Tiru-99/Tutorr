import * as React from "react";
import {
  EmailShell,
  BaseEmailProps,
  CtaButton,
  InfoRow,
  formatWhen,
} from "./Shared";
import { Text } from "@react-email/components";

export type CancellationNotificationProps = BaseEmailProps & {
  cancelledBy: "STUDENT" | "TEACHER" | "SYSTEM";
};

const CancellationNotification: React.FC<CancellationNotificationProps> = ({
  studentName,
  teacherName,
  meetingTime,
  meetingLink,
  bookingId,
  cancelledBy,
  recipientRole,
}) => {
  const isStudent = recipientRole === "STUDENT";

  return (
    <EmailShell
      preview={`Your booking with ${isStudent ? teacherName : studentName} for ${formatWhen(meetingTime)} has been cancelled.`}
      title="Booking Cancelled"
    >
      <Text style={{ marginTop: 0 }}>
        Hi {isStudent ? studentName : teacherName},
      </Text>
      <Text>
        We’re sorry to inform you that your session with{" "}
        <strong>{isStudent ? teacherName : studentName}</strong> has been
        cancelled by {cancelledBy.toLowerCase()}.
      </Text>

      <InfoRow label="Original Time" value={formatWhen(meetingTime)} />
      <InfoRow
        label={isStudent ? "Teacher" : "Student"}
        value={isStudent ? teacherName : studentName}
      />
      <InfoRow label="Booking ID" value={`#${bookingId}`} />

      <div style={{ marginTop: 16 }}>
        <CtaButton href={meetingLink} label="Reschedule Session" />
      </div>
    </EmailShell>
  );
};

export default CancellationNotification;
