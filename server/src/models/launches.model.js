const launches = new Map();

let latestFlightNumber = 100

const launch =  {
    flightNumber:100,
    mission:"Kepler Exploration X",
    rocket:"Explorer 101",
    launchDate:new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer:['Abraham', 'Naiborhu', 'Nasa', 'Space X'],
    upComing: true,
    success: true
  }


launches.set(
    launch.flightNumber,launch 
)
function getAllLaunches(){
    return Array.from(launches.values())
}

function addNewLaunch(launch){
    latestFlightNumber++
    launches.set(
        latestFlightNumber, 
        Object.assign(launch, {
            success:true,
            upComing: true,
            customer: ['Abraham', 'NASA'], 
            flightNumber: latestFlightNumber

    }))
}

function existsLaunchWithId(id){
    return  launches.has(id)

}
function abortLaunchById(id){

    const aborted = launches.get(id)
    aborted.upComing = false;
    aborted.success = false
    return aborted
}
module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}