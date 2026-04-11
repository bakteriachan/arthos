import express from 'express'
import { ClientRouter } from './clients/clients.router.js'
import { connect } from './database.js'

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017'

const app = express()

app.use('/client', ClientRouter)

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
