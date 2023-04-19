import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  messageText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [MessageSchema],
}).set("toJSON", {
  virtuals: true, // enable virtual fields to be included in toJSON output
});

// Define a virtual field to populate the avatar from the receiver
ChatSchema.virtual("receiverAvatar", {
  ref: "User",
  localField: "participants",
  foreignField: "_id",
  justOne: true,
  options: { select: "avatar" }, // only select the avatar field from the User document
});

const Chat = model("Chat", ChatSchema);
export default Chat;
