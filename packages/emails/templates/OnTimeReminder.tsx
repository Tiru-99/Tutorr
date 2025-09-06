import * as React from "react";
import {
  EmailShell,
  BaseEmailProps,
  CtaButton,
  InfoRow,
  formatWhen,
} from "./Shared";
import { Text } from "@react-email/components";

export type OnTimeReminderProps = BaseEmailProps;

const OnTimeReminder: React.FC<OnTimeReminderProps> = ({
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
      preview={`It's time! Your session with ${isStudent ? teacherName : studentName} starts now.`}
      title="Meeting Starting Now"
    >
      <Text style={{ marginTop: 0 }}>
        Hi {isStudent ? studentName : teacherName},
      </Text>
      <Text>
        Your session with{" "}
        <strong>{isStudent ? teacherName : studentName}</strong> is starting now.
      </Text>

      <InfoRow label="Start Time" value={formatWhen(meetingTime)} />
      <InfoRow
        label={isStudent ? "Teacher" : "Student"}
        value={isStudent ? teacherName : studentName}
      />
      <InfoRow label="Booking ID" value={`#${bookingId}`} />

      <div style={{ marginTop: 16 }}>
        <CtaButton href={meetingLink} label="Enter Meeting" />
      </div>
    </EmailShell>
  );
};

export default OnTimeReminder;
