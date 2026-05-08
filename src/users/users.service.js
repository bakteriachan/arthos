import { BadRequestException, ConflictException } from "../shared/errors.js"
import bcrypt from 'bcryptjs'
import { UserModel } from "./users.schema.js"
import { ScopeModel } from "../scopes/scopes.schema.js"
import { validateDto } from "../shared/util.js"

export default {
    create: async function (dto) {
        if(!dto) throw new BadRequestException()
        validateDto(dto, ['name', 'email', 'password', 'clientId'])
        const {
            name,
            email,
            password,
            clientId,
            scopes,
        } = dto

        const exists = await UserModel.findOne({ email: email.toLowerCase(), clientId })
        if(exists) throw new ConflictException('User with that email already exists')

        if(scopes?.length) {
            for(const value of scopes) {
                const valid = await ScopeModel.findOne({ value, clientId })
                if(!valid) throw new BadRequestException(`Scope '${value}' not found for this client`)
            }
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = new UserModel({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            clientId,
            scopes,
        })
        await user.save()
        const { password: _, ...safeUser } = user.toJSON()
        return safeUser
    },
}