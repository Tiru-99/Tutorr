import { Server } from "socket.io";
import { Socket } from "socket.io";


export const setupSocketIO = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        //job ke through communicate karna hai bero 
       socket.emit("hello" , {message : "Hey frontend !"});
    })
}

//test comment