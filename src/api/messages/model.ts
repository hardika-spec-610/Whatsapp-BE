import { Schema, model } from "mongoose";

export interface IMessage {
    sender: string; // user ID
    content: string;
    // define any other message properties you need
}

const MessagesSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        content: {
            text: { type: String, required: true },
        },
    },
    { timestamps: true })

const Messages = model<IMessage>("Message", MessagesSchema);

export default Messages;
