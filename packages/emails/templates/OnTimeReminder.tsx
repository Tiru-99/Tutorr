import * as React from "react";
import { EmailShell, BaseEmailProps, CtaButton, InfoRow, formatWhen } from "./Shared";
import { Text } from "@react-email/components";


export type OnTimeReminderProps = BaseEmailProps & {};


const OnTimeReminder: React.FC<OnTimeReminderProps> = ({
    studentName,
    teacherName,
    meetingTime,
    meetingLink,
    bookingId,
}) => (
    <EmailShell
        preview={`It's time! Your session with ${teacherName} starts now.`}
        title="Meeting Starting Now"
    >
        <Text style={{ marginTop: 0 }}>
            Hi {studentName},
        </Text>
        <Text>
            Your session with <strong>{teacherName}</strong> is starting now.
        </Text>


        <InfoRow label="Start Time" value={formatWhen(meetingTime)} />
        <InfoRow label="Teacher" value={teacherName} />
        <InfoRow label="Booking ID" value={`#${bookingId}`} />


        <div style={{ marginTop: 16 }}>
            <CtaButton href={meetingLink} label="Enter Meeting" />
        </div>


        <Text style={{ marginTop: 16, fontSize: 12 }}>
            If you have trouble, try opening the link in another browser window or device.
        </Text>
    </EmailShell>
);


export default OnTimeReminder;