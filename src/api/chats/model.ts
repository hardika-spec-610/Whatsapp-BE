import { Schema, model } from 'mongoose'
import { User } from '../users/types'
import { IMessage } from '../messages/model'

interface IChat extends Document {
    members: User[];
    messages: IMessage[];
}

const ChatsSchema = new Schema({
    members: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
})

const Chats = model<IChat>('Chat', ChatsSchema)

export default Chats