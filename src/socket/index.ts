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

  socket.on("enterChat", (chatId: string) => {
    console.log("enterChat");
    socket.join(chatId);
    socket.emit("roomEntered", chatId);
  });

  socket.on("sendMessage", async (message: message & { chatId: string }) => {
    console.log("sendMessage:", message);
    const newMessage = new ChatModel(message);
    const { _id } = await newMessage.save();
    const savedMessage = await ChatModel.findById(_id);
    console.log("savedMessage:", savedMessage);
    socket.emit("newMessage", message);
  });
};
