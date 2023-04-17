import { Model, Document } from "mongoose"

interface User {
    name: string
    password: string
    email: string
    avatar: string
    status: "online" | "offline"
}

export interface UserDocument extends User, Document { }

export interface UserModel extends Model<UserDocument> {
    checkCredentials(email: string, password: string): Promise<UserDocument | null>
}
