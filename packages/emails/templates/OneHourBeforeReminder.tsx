import * as React from "react";
import { EmailShell, BaseEmailProps, CtaButton, InfoRow, formatWhen } from "./Shared";
import { Text } from "@react-email/components";


export type OneHourBeforeReminderProps = BaseEmailProps & {};


const OneHourBeforeReminder: React.FC<OneHourBeforeReminderProps> = ({
    studentName,
    teacherName,
    meetingTime,
    meetingLink,
    bookingId,
}) => (
    <EmailShell
        preview={`Reminder: Your session with ${teacherName} starts in 1 hour.`}
        title="Meeting Reminder: 1 Hour Left"
    >
        <Text style={{ marginTop: 0 }}>
            Hi {studentName},
        </Text>
        <Text>
            A quick reminder that your session with <strong>{teacherName}</strong> starts in one hour.
        </Text>


        <InfoRow label="Starts" value={formatWhen(meetingTime)} />
        <InfoRow label="Teacher" value={teacherName} />
        <InfoRow label="Booking ID" value={`#${bookingId}`} />


        <div style={{ marginTop: 16 }}>
            <CtaButton href={meetingLink} label="Join When Ready" />
        </div>


        <Text style={{ marginTop: 16, fontSize: 12 }}>
            Make sure your mic/camera work and you have a stable internet connection.
        </Text>
    </EmailShell>
);


export default OneHourBeforeReminder;