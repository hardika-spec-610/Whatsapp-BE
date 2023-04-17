import { Schema, model } from "mongoose";

const MessagesSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        content: {
            text: { type: String, required: true },
        },
    },
    { timestamps: true })

const Messages = model("Message", MessagesSchema);

export default Messages;
