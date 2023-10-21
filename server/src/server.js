const http = require('http')

const app = require('./app')

const PORT = process.env.PORT || 8000 // we set flexible or 8000 because our client runs on 3000 so that it does not conflict.

const server = http.createServer(app)

server.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}...`)
})

