import { Schema, model } from 'mongoose'

const ChatsSchema = new Schema({
    members: [{ type: [Schema.Types.ObjectId], required: true, ref: 'User' }],
    messages: [{ type: [Schema.Types.ObjectId], ref: 'Message' }]
})

const Chats = model('Chat', ChatsSchema)

export default Chats