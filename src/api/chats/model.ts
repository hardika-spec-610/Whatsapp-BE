import { Schema, model } from "mongoose";

interface IMessage {
  senderId: string;
  receiverId: string;
  messageText: string;
  timestamp?: Date;
  _id?: string;
}

interface IChat {
  participants: string[];
  messages: IMessage[];
}

const MessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  messageText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [MessageSchema],
});


const Chat = model<IChat>("Chat", ChatSchema);
export { IChat, IMessage };
export default Chat;
