const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
/*This is how promise works
const promise = new promise((resolve, reject)=>{
    resolve(42)
});
promise.then((result)=>{

})
const result = await promise;
console.log(result)
*/
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          //insert + udpate = upsert
          // TODO: Create upsert for data planet
          // await planets.create({
          //   kepler_name: data.kepler_name,
          // });
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        console.log("done");
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, { kepler_name: 1, _id: 0 });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        kepler_name: planet.kepler_name,
      },
      {
        kepler_name: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.log(`Could not save planet ${err}`);
  }
}

module.exports = {
  getAllPlanets,
  loadPlanetsData,
};
