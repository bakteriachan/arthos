import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { BadRequestException, ForbiddenException, UnauthorizedException } from '../shared/errors.js'
import { validateDto } from '../shared/util.js'
import { redis } from '../shared/redis.js'
import { UserModel } from '../users/users.schema.js'
import ResourcesService from '../resources/resources.service.js'
import { AuthTokenModel } from './auth.schema.js'

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 24 // 24 dias
const JWT_SECRET = process.env.JWT_SECRET

export default {
    login: async function (dto, clientId) {
        if(!dto) throw new BadRequestException()
        validateDto(dto, ['email', 'password'])
        const { email, password } = dto

        const user = await UserModel.findOne({ email: email.toLowerCase(), clientId })
        if(!user) throw new UnauthorizedException()

        const valid = bcrypt.compareSync(password, user.password)
        if(!valid) throw new UnauthorizedException()

        const scopes = user.scopes
        const expiresAt = new Date(Date.now() + TOKEN_TTL_MS)

        const jwtToken = jwt.sign(
            { userId: user._id.toString(), clientId: user.clientId, scopes },
            JWT_SECRET,
            { expiresIn: Math.floor(TOKEN_TTL_MS / 1000) }
        )

        const token = new AuthTokenModel({
            token: jwtToken,
            userId: user._id.toString(),
            clientId: user.clientId,
            scopes,
            expiresAt,
        })
        await token.save()

        return { token: jwtToken, expiresAt }
    },
    logout: async function (userId, token, tokenExp) {
        await AuthTokenModel.deleteOne({ token })

        const ttl = Math.max(tokenExp - Math.floor(Date.now() / 1000), 1)
        await redis.set(`revoked:${token}`, '1', 'EX', ttl)

        const keys = await redis.keys(`validate:${userId}:*`)
        if(keys.length > 0) await redis.del(...keys)
    },
    validate: async function (resourceName, userScopes, userId, tokenExp, clientId, rawToken) {
        validateDto({ resourceName }, ['resourceName'])

        const isRevoked = await redis.get(`revoked:${rawToken}`)
        if(isRevoked) throw new UnauthorizedException()

        const cacheKey = `validate:${userId}:${resourceName}`
        const cached = await redis.get(cacheKey)
        if(cached) return JSON.parse(cached)

        const resource = await ResourcesService.getByName(resourceName, clientId)

        const userScopesSet = new Set(userScopes)
        const hasAccess = resource.requiredScopes.every(s => userScopesSet.has(s))
        if(!hasAccess) throw new ForbiddenException()

        const result = { granted: true, resource: resource.name, scopes: resource.requiredScopes }
        const ttl = Math.max(tokenExp - Math.floor(Date.now() / 1000), 1)
        await redis.set(cacheKey, JSON.stringify(result), 'EX', ttl)

        return result
    },
}
