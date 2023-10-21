// WE WILL PUT ALL OF OUR EXPRESS CODE HERE
const express = require('express')
const cors = require('cors')

const planetsRouter = require('./routes/planets/planets.router')

const app = express()

// const whiteList = ['http://localhost']
// const corsOptions = {
//     origin: function (origin, callback) {
//       if (whiteList.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS'))
//       }
//     }
//   }
app.use(cors({origin: 'http://localhost:3000'}))
app.use(express.json())
app.use(planetsRouter)

module.exports = app;