import { Server } from "socket.io";
import { Socket } from "socket.io";
import { Job, Queue } from 'bullmq';
import { BookingQueue } from "@tutorr/common";
import redis from "@tutorr/common";
import { QueueEvents } from "bullmq";




export const setupSocketIO = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        //job ke through communicate karna hai bero 
       socket.emit("hello" , {message : "Hey frontend !"});
    })
}