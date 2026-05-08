import { model, Schema } from "mongoose";

const AuthToken = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    clientId: { type: String, required: true },
    scopes: { type: [String], required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
}, { timestamps: true })

export const AuthTokenModel = model('AuthToken', AuthToken)