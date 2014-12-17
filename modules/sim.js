var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var queue = [];
var running = false;

function simulate(player){
  queue.push(player);
  if (running === false)
  {
    running = true;
    setTimeout(runSimC, 0);
  }
}

function runSimC(){
  var player = queue.shift();
  if (player !== null)
  {
    var simcPath = path.join(process.cwd(), 'lib/simulationcraft/engine/simc');
    var simcExec = simcPath + " armory=us," + player.realm + "," + player.name + " iterations=1000 xml=report.xml html=" + player.realm + "-" + player.name + ".html";
    var dataPath = path.join(process.cwd(), 'data');
    exec(simcExec,{
      cwd: dataPath
    },
    function(err, out, code) {
      if (queue.length > 0){
        setTimeout(runSimC, 0);
      }
    });
  }
  else
  {
    running = false;
  }
}

module.exports.simulate = simulate;
