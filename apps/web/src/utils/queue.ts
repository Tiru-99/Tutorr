import { BookingQueue , NotificationQueue } from "@tutorr/common";
import getRedis from "@tutorr/common";
import { get } from "http";

const redis = getRedis(); 

export const bookingQueue = new BookingQueue(redis); 
export const notificationQueue = new NotificationQueue(redis)