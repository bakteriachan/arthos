import { model, Schema } from "mongoose";

const Resource = new Schema({
    name: { type: String, required: true },
    clientId: { type: String, required: true },
    requiredScopes: { type: [String], required: true },
})

Resource.index({ name: 1, clientId: 1 }, { unique: true })

export const ResourceModel = model('Resource', Resource)