export function ErrorsMiddleware(next, req, res, error) {
    if(error) {
        return res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
    }
    next()
}