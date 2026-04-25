import ClientsService from "../clients/clients.service.js"
import { UnauthorizedException } from "../shared/errors.js"

export async function ClientAuthorization(req, res, next) {
    const authorization = req.headers['authorization']
    if(!authorization) throw new UnauthorizedException()
    
    let basic = authorization.split('Basic ')
    if(basic.length < 2) throw new UnauthorizedException()
    
    basic = Buffer.from(basic[1], 'base64').toString().split(':')
    const clientId = basic[0]
    const clientSecret = basic[1]

    let client
    try {
        client = await ClientsService.getByClientId(clientId)
    } catch(e) {
        throw new UnauthorizedException()
    }
    if(client.clientSecret != clientSecret) throw new UnauthorizedException()

    req.clientId = client.clientId
    next()
}