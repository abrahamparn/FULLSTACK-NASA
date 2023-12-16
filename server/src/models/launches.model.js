const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer 101",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["Abraham", "Naiborhu", "Nasa", "Space X"],
  upComing: true,
  success: true,
};
saveLaunch(launch);

async function getAllLaunches() {
  return await launches.find({}, { __v: 0, _id: 0 });
}

async function saveLaunch(launch) {
  const exists = await planets.findOne({ kepler_name: launch.target });
  if (!exists) {
    throw new Error("No matching planets was found");
  }
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upComing: true,
    customer: ["Abraham", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function existsLaunchWithId(id) {
  return await launches.findOne({ flightNumber: id });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne({}).sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}
async function abortLaunchById(id) {
  const aborted = await launches.updateOne(
    {
      flightNumber: id,
    },
    {
      upComing: false,
      success: false,
    }
  );
  console.log(aborted);
  if (aborted.modifiedCount === 1) {
    return true;
  } else {
    return false;
  }
  //   const aborted = launches.get(id);
  //   aborted.upComing = false;
  //   aborted.success = false;
  //   return aborted;
}
module.exports = {
  getAllLaunches,
  existsLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById,
};
