import * as React from "react";
import {
  EmailShell,
  BaseEmailProps,
  CtaButton,
  InfoRow,
  formatWhen,
} from "./Shared";
import { Text } from "@react-email/components";

export type OneHourBeforeReminderProps = BaseEmailProps;

const OneHourBeforeReminder: React.FC<OneHourBeforeReminderProps> = ({
  studentName,
  teacherName,
  meetingTime,
  meetingLink,
  bookingId,
  recipientRole,
}) => {
  const isStudent = recipientRole === "STUDENT";

  return (
    <EmailShell
      preview={`Reminder: Your session with ${isStudent ? teacherName : studentName} starts in 1 hour.`}
      title="Meeting Reminder: 1 Hour Left"
    >
      <Text style={{ marginTop: 0 }}>
        Hi {isStudent ? studentName : teacherName},
      </Text>
      <Text>
        Reminder: Your session with{" "}
        <strong>{isStudent ? teacherName : studentName}</strong> starts in one
        hour.
      </Text>

      <InfoRow label="Starts" value={formatWhen(meetingTime)} />
      <InfoRow
        label={isStudent ? "Teacher" : "Student"}
        value={isStudent ? teacherName : studentName}
      />
      <InfoRow label="Booking ID" value={`#${bookingId}`} />

      <div style={{ marginTop: 16 }}>
        <CtaButton href={meetingLink} label="Join When Ready" />
      </div>
    </EmailShell>
  );
};

export default OneHourBeforeReminder;
