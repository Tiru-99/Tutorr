export interface NotificationJobType {
    jobType : "instant" | "one-hour-before" | "on-time" | "cancel-booking" ; 
    bookingId : string ;  
    startTime : string | Date | null ; 
}

export type CancelBookingNotificationType = Omit<NotificationJobType , "startTime">