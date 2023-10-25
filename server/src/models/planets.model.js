const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse');

const habitablePlanet = [];
function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
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
function loadPlanetsData(){
    return new Promise((resolve, reject)=>{
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
          comment: '#',
          columns: true,
        }))
        .on('data', (data)=>{
          if(isHabitablePlanet(data)){
              habitablePlanet.push(data)
      
          }
        })
        .on('error', (err) => {
          console.log(err)
          reject(err);
        })
        .on('end', () =>{
          console.log(`${habitablePlanet.length} habitable planets found!`)
          console.log('done')
          resolve();
        })
    })
   
}
function getAllPlanets(){
  return habitablePlanet;
}
  
module.exports = {
  getAllPlanets,
  loadPlanetsData,
}