import mongoose from "mongoose"

export async function connect(uri) {
    return new Promise((res, rej) => {
        console.log('[DATABASE] connecting...')
        mongoose.connect(uri).then(() => { console.log('[DATABASE] connected'); res() }).catch(error => rej(error))
    })
}