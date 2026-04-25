import { Schema } from "mongoose";
import { Scope } from "../scopes/scopes.schema.js";

const User = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    clientId: { type: String, required: true },
    scopes: { type: [Scope], required: true },
})

export const UserModel = model('User', User)