import { Schema, model } from "mongoose";
import { User } from '../users/types'

export interface IMessage extends Document {
    sender: User; // user ID
    content: {
        text?: string;
        media?: string;
    };
}

const MessagesSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        content: {
            type: {
                text: { type: String },
                media: { type: String },
            },
            required: true,
        },
    },
    { timestamps: true })

const Messages = model<IMessage>("Message", MessagesSchema);

export default Messages;
