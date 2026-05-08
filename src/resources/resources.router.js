import { Router } from "express";
import { ClientAuthorization } from "../middlewares/client-auth.middleware.js";
import ResourcesService from "./resources.service.js";

const ResourcesRouter = Router()

ResourcesRouter.post('/', ClientAuthorization, async (req, res) => {
    const resource = await ResourcesService.create({
        ...req.body,
        clientId: req.clientId,
    })
    return res.status(201).json(resource)
})

ResourcesRouter.get('/', ClientAuthorization, async (req, res) => {
    const resources = await ResourcesService.getAllByClientId(req.clientId)
    return res.status(200).json(resources)
})

export { ResourcesRouter }