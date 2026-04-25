import { Router } from "express"
import { ClientAuthorization } from "../middlewares/client-auth.middleware.js"
import UsersService from "./users.service.js"

const UsersRouter = Router()


UsersRouter.post('/', ClientAuthorization, (req, res) => {
    const entity = UsersService.create(req.body)
})

export { UsersRouter }