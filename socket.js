import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  /**
   * TODO
   * switch this to sqllite
   */
  const userSocketMap = new Map(); 

  const disconnect = (socket) => {
    console.log(`client disconnected from socket: ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`user ${userId} disconnected`);
        break;
      }
    }
  };

  const sendMessage= async (message)=>{

    const senderSocketId= userSocketMap.get(message.sender);
    const receiverSocketId= userSocketMap.get(message.recipient);
    const createdMessage= await Message.create(message);

    const messageData = await Message.findById(createdMessage._id).populate("sender", "_id email first_name last_name img color").populate("recipient", "_id email first_name last_name img color");
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  
  }

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);

      console.log(`User connected: ${userId} with socket id: ${socket.id}`);
    } else {
      console.log("User id not provided during connection");
    }
    
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", disconnect);
  });
};

export default setupSocket;
