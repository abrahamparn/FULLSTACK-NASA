// WE WILL PUT ALL OF OUR EXPRESS CODE HERE
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./routes/api");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("combined"));
app.use(express.json());

//This middleware below is for production
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", api.api);

//This code below is to set so that the user does not have to change from index.html to the homepage
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
