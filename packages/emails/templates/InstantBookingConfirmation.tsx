import * as React from "react";
import { EmailShell, BaseEmailProps, CtaButton, InfoRow, formatWhen } from "./Shared";
import { Text } from "@react-email/components";


export type InstantBookingConfirmationProps = BaseEmailProps & {
    studentName: string;
};


const InstantBookingConfirmation: React.FC<InstantBookingConfirmationProps> = ({
    studentName,
    teacherName,
    meetingTime,
    meetingLink,
    bookingId,
}) => (
    <EmailShell
        preview={`Booking confirmed with ${teacherName} on ${formatWhen(meetingTime)}.`}
        title="Booking Confirmed"
    >
        <Text style={{ marginTop: 0 }}>
            Hi {studentName},
        </Text>
        <Text>
            Your session with <strong>{teacherName}</strong> is confirmed. Save the details below and feel free to share the meeting link with your calendar.
        </Text>


        <InfoRow label="When" value={formatWhen(meetingTime)} />
        <InfoRow label="Teacher" value={teacherName} />
        <InfoRow label="Booking ID" value={`#${bookingId}`} />


        <div style={{ marginTop: 16 }}>
            <CtaButton href={meetingLink} label="Open Meeting Room" />
        </div>


        <Text style={{ marginTop: 16, fontSize: 12 }}>
            Tip: Add this to your calendar to avoid missing the session.
        </Text>
    </EmailShell>
);


export default InstantBookingConfirmation;