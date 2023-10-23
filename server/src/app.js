// WE WILL PUT ALL OF OUR EXPRESS CODE HERE
const path = require('path')
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
//This middleware below is for production
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(planetsRouter)

//This code below is to set so that the user does not have to change from index.html to the homepage
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
module.exports = app;