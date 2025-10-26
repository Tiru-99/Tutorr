import * as React from "react";
import {
  EmailShell,
  BaseEmailProps,
  CtaButton,
  InfoRow,
  formatWhen,
} from "./Shared";
import { Text } from "@react-email/components";

export type InstantBookingConfirmationProps = BaseEmailProps;

const InstantBookingConfirmation: React.FC<
  InstantBookingConfirmationProps
> = ({ studentName, teacherName, meetingTime, meetingLink, bookingId, recipientRole }) => {
  const isStudent = recipientRole === "STUDENT";

  return (
    <EmailShell
      preview={`Booking confirmed with ${isStudent ? teacherName : studentName} on ${formatWhen(meetingTime)}.`}
      title="Booking Confirmed"
    >
      <Text style={{ marginTop: 0 }}>
        Hi {isStudent ? studentName : teacherName},
      </Text>
      <Text>
        Your session with{" "}
        <strong>{isStudent ? teacherName : studentName}</strong> is confirmed.
      </Text>

      <InfoRow label="When" value={formatWhen(meetingTime)} />
      <InfoRow
        label={isStudent ? "Teacher" : "Student"}
        value={isStudent ? teacherName : studentName}
      />
      <InfoRow label="Booking ID" value={`#${bookingId}`} />

      <div style={{ marginTop: 16 }}>
        <CtaButton href={meetingLink} label="Open Meeting Room" />
      </div>
    </EmailShell>
  );
};

export default InstantBookingConfirmation;
