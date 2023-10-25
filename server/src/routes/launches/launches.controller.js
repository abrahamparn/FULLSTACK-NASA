const {getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById} = require('../../models/launches.model')

function httpGetAllLaunches(req, res){
    return res.status(200).json(Array.from(getAllLaunches()))
}

function httpAddNewLaunch(req, res){
    const launch = req.body;


    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error: "Missing required launch property"
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: "Invalid date format"
        })
    }
    addNewLaunch(launch);

    return res.status(201).json(launch)
}

function httpAbordLaunch(req, res){
    const id = +req.params.id
    console.log(id)
    // if launch does not exists
    if(!existsLaunchWithId(id)){
        return res.status(404).json({
            error: "Launch is not found"
        })
    }
    const aborted = abortLaunchById(id)
    return res.status(200).json(aborted)

}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbordLaunch
}