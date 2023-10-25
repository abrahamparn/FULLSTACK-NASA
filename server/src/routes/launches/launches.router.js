const express = require('express')

const launchesRouter = express.Router()

const {httpGetAllLaunches, httpAddNewLaunch, httpAbordLaunch} = require('./launches.controller')

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.delete('/:id', httpAbordLaunch)

module.exports = launchesRouter