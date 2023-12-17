const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const { response } = require("../app");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer 101", //rocket.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b", //not applicable
  customer: ["Abraham", "Naiborhu", "Nasa", "Space X"], //payloads.customers
  upComing: true, //upcoming
  success: true, //success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem donwloading launch data");
    throw new Error("launch data downoad failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const TheCustomers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    console.log(TheCustomers);
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upComing: launchDoc.upcoming,
      success: launchDoc.success,
      customer: TheCustomers,
    };

    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("launch data already loaded");
  } else {
    await populateLaunches();
  }
  console.log("Downloading launch data");
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { __v: 0, _id: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
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
  const exists = await planets.findOne({ kepler_name: launch.target });
  if (!exists) {
    throw new Error("No matching planets was found");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upComing: true,
    customer: ["Abraham", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existsLaunchWithId(id) {
  return await findLaunch({ flightNumber: id });
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
  loadLaunchesData,
};
