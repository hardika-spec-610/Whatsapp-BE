import { Socket } from "socket.io";

import ChatModel from "../api/chats/model";
interface payload {
  username: String;
  email: String;
  password: String;
}

interface user {
  username: String;
  socketId: String;
}

interface message {
  participants: [];
  messages: [{ senderId: String; receiverId: String; messageText: String }];
}

let onlineUsers: user[] = [];

export const newConnectionHandler = (socket: Socket) => {
  socket.emit("welcome", { message: `Hello ${socket.id}` });

  socket.on("setUsername", (payload: payload) => {
    onlineUsers.push({ username: payload.username, socketId: socket.id });
  });

  socket.emit("loggedIn", onlineUsers);

  socket.on("sendMessage", async (message: message) => {
    socket.broadcast.emit("newMessage", message);
    const newMessage = new ChatModel(message);
    const { _id } = await newMessage.save();
  });
};
