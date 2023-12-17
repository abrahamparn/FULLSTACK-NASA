const http = require("http");
require("dotenv").config();
const app = require("./app");
const mongoConnect = require("./services/mongo");
const planetsModel = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");
const PORT = process.env.PORT || 8000; // we set flexible or 8000 because our client runs on 3000 so that it does not conflict.

const server = http.createServer(app);

async function startServer() {
  await mongoConnect.mongoConnect();
  await planetsModel.loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

startServer();
