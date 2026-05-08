import { Schema, model } from "mongoose";

const User = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    clientId: { type: String, required: true },
    scopes: { type: [String], required: true },
})

User.index({ email: 1, clientId: 1 }, { unique: true })

export const UserModel = model('User', User)