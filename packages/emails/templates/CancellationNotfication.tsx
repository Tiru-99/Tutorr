import * as React from "react";
import { EmailShell, BaseEmailProps, CtaButton, InfoRow, formatWhen } from "./Shared";
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
}) => (
    <EmailShell
        preview={`Your booking with ${teacherName} for ${formatWhen(meetingTime)} has been cancelled.`}
        title="Booking Cancelled"
    >
        <Text style={{ marginTop: 0 }}>
            Hi {studentName},
        </Text>
        <Text>
            We’re sorry to inform you that your session with <strong>{teacherName}</strong> has been cancelled by the ({cancelledBy.toLocaleLowerCase()}).
        </Text>


        <InfoRow label="Original Time" value={formatWhen(meetingTime)} />
        <InfoRow label="Teacher" value={teacherName} />
        <InfoRow label="Booking ID" value={`#${bookingId}`} />


        <div style={{ marginTop: 16 }}>
            <CtaButton href={meetingLink} label="Reschedule Session" />
        </div>


        <Text style={{ marginTop: 16, fontSize: 12 }}>
            If you think this was a mistake, please reach out to support.
        </Text>
    </EmailShell>
);


export default CancellationNotification;