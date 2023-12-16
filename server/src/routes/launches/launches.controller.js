const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(Array.from(await getAllLaunches()));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid date format",
    });
  }
  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpAbordLaunch(req, res) {
  const id = +req.params.id;
  console.log(id);
  // if launch does not exists
  const existLaunch = await existsLaunchWithId(id);
  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch is not found",
    });
  }
  const aborted = await abortLaunchById(id);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted or something wrong",
    });
  }
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbordLaunch,
};
