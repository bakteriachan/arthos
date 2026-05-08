import { Router } from 'express'
import { ClientAuthorization } from '../middlewares/client-auth.middleware.js'
import { JwtAuthorization } from '../middlewares/jwt-auth.middleware.js'
import AuthService from './auth.service.js'

const AuthRouter = Router()

AuthRouter.post('/login', ClientAuthorization, async (req, res) => {
    const token = await AuthService.login(req.body, req.clientId)
    return res.status(200).json(token)
})

AuthRouter.post('/logout', JwtAuthorization, async (req, res) => {
    await AuthService.logout(req.userId, req.rawToken, req.tokenExp)
    return res.status(204).send()
})

AuthRouter.post('/validate', JwtAuthorization, async (req, res) => {
    const result = await AuthService.validate(req.body.resourceName, req.scopes, req.userId, req.tokenExp, req.clientId, req.rawToken)
    return res.status(200).json(result)
})

export { AuthRouter }
