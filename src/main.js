import express from 'express'
import { ClientRouter } from './clients/clients.router.js'
import { connect } from './database.js'
import { ErrorsMiddleware } from './middlewares/errors.js'
import { UsersRouter } from './users/users.router.js'

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017'

const app = express()
app.use(express.json())

app.use('/client', ClientRouter)
app.use('/user', UsersRouter)

app.use(ErrorsMiddleware)

async function bootstrap() {
    await connect(MONGO_URI)
    app.listen(PORT, (error) => {
        if(error) {
            console.error(error)
            return
        }
        console.log(`Application listening on port ${PORT}`)
    })
}

bootstrap().catch(error => {
    console.error(`Boostrap error: ${error}`)
})
