var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var queue = [];
var running = false;
var xml2js = require('xml2js');

var dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir))
  fs.mkdirSync(dataDir);
  
var tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir))
  fs.mkdirSync(tempDir);

var simcPath = path.join(process.cwd(), 'lib/simulationcraft/engine/simc');
if (!fs.existsSync(simcPath))
  simcPath = path.join(process.cwd(), 'lib/simulationcraft/simc.exe');
if (!fs.existsSync(simcPath))
  throw "Couldn't find simc";

function simulate(player){
  queue.push(player);
  if (running === false)
  {
    running = true;
    setTimeout(runSimC, 0);
  }
}

function copyResults(player){
  var realmDir = path.join(dataDir, player.realm.replace('\'', '')).toLowerCase();
  var report = path.join(tempDir, "report.html");
  if (!fs.existsSync(realmDir)){
    fs.mkdirSync(realmDir);
  }
  
  var destination = path.join(realmDir, player.name + ".html").toLowerCase();
  fs.writeFileSync(destination, fs.readFileSync(report));
}

function parseResults(player){
  var parser = new xml2js.Parser();
  var reportFile = path.join(process.cwd(), 'temp/report.xml');
  fs.readFile(reportFile, function (err, data) {
    parser.parseString (data, function (err, result) {
      var playerResult = result.simulationcraft.players[0].player[0];
      var eventData = {
        dps: playerResult.dps[0]['$'].value,
        details: (player.realm.replace('\'', '') + "/" + player.name + ".html").toLowerCase(),
        name: player.name,
        realm: player.realm
      };
      
      global.socket.emit("character:simcomplete", eventData);
    });
  });
}

function runSimC(){
  var player = queue.shift();
  if (player !== null)
  {  
    console.log("running sim for: " + JSON.stringify(player));
    var simcExec = simcPath + " armory=us," + player.realm + "," + player.name + " iterations=10 xml=report.xml html=report.html";
    exec(simcExec,{
      cwd: tempDir
    },
    function(err, out, code) {
      if (code == 0){
        copyResults(player);
        parseResults(player);
      }
      if (queue.length > 0){
        setTimeout(runSimC, 0);
      }
      else{
        running = false;
      }
    });
  }
  else
  {
    running = false;
  }
}

module.exports.simulate = simulate;
