import { model, Schema } from 'mongoose'

export const Client = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    clientId: { type: String, required: true },
    clientSecret: { type: String, required: true },
})

export const ClientModel = model('Client', Client)