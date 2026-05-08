import { model, Schema } from 'mongoose'

export const Scope = new Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    clientId: { type: String, required: true },
})

Scope.index({ value: 1, clientId: 1 }, { unique: true })

export const ScopeModel = model('Scope', Scope)