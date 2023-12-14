const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");

const planetsModel = require("./models/planets.model");

const PORT = process.env.PORT || 8000; // we set flexible or 8000 because our client runs on 3000 so that it does not conflict.

const MONGO_URL =
  "mongodb+srv://nasa-api:dqjegsLWA6zY09fC@atlascluster.rtopyd5.mongodb.net/nasa?retryWrites=true&w=majority";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection Ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await planetsModel.loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

startServer();
