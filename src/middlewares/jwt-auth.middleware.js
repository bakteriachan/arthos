import jwt from 'jsonwebtoken'
import { UnauthorizedException } from '../shared/errors.js'

export function JwtAuthorization(req, res, next) {
    const authorization = req.headers['authorization']
    if(!authorization) throw new UnauthorizedException()

    const [, token] = authorization.split('Bearer ')
    if(!token) throw new UnauthorizedException()

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = payload.userId
        req.clientId = payload.clientId
        req.scopes = payload.scopes
        req.tokenExp = payload.exp
        req.rawToken = token
    } catch {
        throw new UnauthorizedException()
    }

    next()
}
