import { model, Schema } from 'mongoose'

export const Scope = new Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    clientId: { type: String, required: true },
})

export const ScopeModel = model('Scope', Scope)