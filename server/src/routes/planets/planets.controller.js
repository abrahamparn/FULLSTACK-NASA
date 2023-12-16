const planets = require("../../models/planets.model");

async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await planets.getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
