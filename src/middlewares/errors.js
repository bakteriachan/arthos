import { HttpException } from "../shared/errors.js"

export function ErrorsMiddleware(error, req, res, next) {
    if(error) {
        console.error(error)
        const response = {
            statusCode: error.statusCode ?? 500,
            message: error.message ?? "Internal Server Error"
        }
        if(error instanceof HttpException) {
            response.name = error.constructor.name
        }
        return res.status(response.statusCode).json(response)
    }
    next()
}