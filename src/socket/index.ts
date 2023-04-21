import { Socket } from "socket.io";

import ChatModel, { IMessage } from "../api/chats/model";
import UserModel from "../api/users/model";
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

// let onlineUsers: user[] = [];

// export const newConnectionHandler = async (socket: Socket) => {
//   try {
//     socket.emit("welcome", { message: `Hello ${socket.id}` });

//     // socket.on("joinChatRoom", async ({ chatId }) => {
//     //   socket.join(chatId);

//     //   try {
//     //     // Get the messages for this chat and emit them to the client
//     //     const chat = await ChatModel.findById(chatId).populate("messages.senderId");
//     //     if (chat) { socket.emit("initChat", chat.messages); }

//     //   } catch (error) {
//     //     console.log(error);
//     //   }
//     // });
//     // // Leave a chat room
//     // socket.on("leaveChatRoom", ({ chatId }) => {
//     //   socket.leave(chatId);
//     // });

//     // // Receive a new message and emit it to the chat room
//     // socket.on("sendMessage", async ({ chatId, senderId, messageText }) => {
//     //   try {
//     //     const newMessage = await ChatModel.findByIdAndUpdate(
//     //       chatId,
//     //       {
//     //         $push: {
//     //           messages: {
//     //             senderId,
//     //             messageText,
//     //           },
//     //         },
//     //       },
//     //       { new: true }
//     //     ).populate("messages.senderId");
//     //     if (newMessage) { socket.to(chatId).emit("receiveMessage", newMessage.messages[newMessage.messages.length - 1]); }

//     //   } catch (error) {
//     //     console.log(error);
//     //   }
//     // });

//     // Clean up when the user disconnects
//     // socket.on("disconnect", () => {
//     //   console.log("User disconnected");
//     // });
//     // Get the username from the client and store it in the database
//     socket.on("setUsername", async (payload: payload) => {
//       const { username } = payload;

//       // Add the user to the database
//       const user = new UserModel({ username, socketId: socket.id });
//       await user.save();

//       // Send the list of online users to the client
//       const onlineUsers = await UserModel.find({});
//       socket.emit("loggedIn", onlineUsers);
//       socket.broadcast.emit("updateOnlineUsersList", onlineUsers);
//     });

//     // Listen for new messages from the client
//     socket.on("sendMessage", async (message: message) => {
//       socket.broadcast.emit("newMessage", message);

//       // Save the message to the database
//       const newMessage = new ChatModel(message);
//       const { _id } = await newMessage.save();
//     });
//     // Listen for disconnections and update the list of online users
//     socket.on("disconnect", async () => {
//       // Remove the user from the database
//       await UserModel.findOneAndDelete({ socketId: socket.id });

//       // Send the updated list of online users to all clients
//       const onlineUsers = await UserModel.find({});
//       socket.broadcast.emit("updateOnlineUsersList", onlineUsers);
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

// ChatModel.findById(chatId) because we're looking for a single chat by its ID.
//Then, I populated the messages.senderId field so that we can access the sender user's data in the frontend.
//Finally, I emitted only the messages field of the chat object to the client.
//In the sendMessage event, ChatModel.findByIdAndUpdate so that we can update the chat's messages array instead of creating a new chat document.
//Then, I used $push to add the new message to the messages array.
//After that, I used the populate method to populate the messages.senderId field again so that we can access the sender user's data in the frontend.
//Finally, I emitted only the last message in the messages array to the chat room using
//socket.to(chatId).emit("receiveMessage", newMessage.messages[newMessage.messages.length - 1]).
let users: user[] = [];

export const newConnectionHandler = (socket: Socket) => {
  console.log(`New user ${socket.id}`);
  socket.emit("welcome", { message: `new user ${socket.id}` });

  socket.on("user-connected", (payload) => {
    users.push({ username: payload.username, socketId: socket.id });
    socket.emit("connected", users);
  });

  socket.on("join-room", async (room) => {
    console.log("joined room", room);
    socket.join(room);

    try {
      const chat = await ChatModel.findById(room);
      socket.emit("joined-room", chat?.messages);
    } catch (err) {
      console.error("Error fetching chat", err);
    }
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
  });

  socket.on("outgoing-msg", async (data) => {
    const newMsg: IMessage = {
      senderId: data.sender,
      receiverId: data.room,
      messageText: data.text,
    };
    console.log("newMsg", newMsg);
    try {
      const updated = await ChatModel.findByIdAndUpdate(
        data.room,
        { $push: { messages: newMsg } },
        { new: true, runValidators: true }
      );
      socket.to(data.room).emit(
        "incoming-msg",
        updated?.messages[updated.messages.length - 1]
      );
    } catch (err) {
      console.error("Error updating chat", err);
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    socket.broadcast.emit("updateOnlineUsersList", users);
  });
};