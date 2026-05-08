import { Router } from "express"
import { ClientAuthorization } from "../middlewares/client-auth.middleware.js"
import UsersService from "./users.service.js"

const UsersRouter = Router()


UsersRouter.post('/', ClientAuthorization, async (req, res) => {
    const entity = await UsersService.create({ ...req.body, clientId: req.clientId })
    return res.status(201).json(entity)
})

export { UsersRouter }