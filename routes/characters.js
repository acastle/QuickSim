var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');

function onCharacterLoaded(data) {
  global.socket.emit("character:loaded", data);
}

router.get('/:realm/:name', function(req, res) {
  var data = {
    fields: "talents,items",
    locale: "en_US",
    apiKey: process.env["BATTLENET_API_KEY"]
  };
  var endpoint = "/wow/character/" + req.params.realm + "/" + req.params.name + "?" + querystring.stringify(data);
  var options = {
    host: "us.api.battle.net",
    path: endpoint,
    method: "GET"
  };

  console.log("calling: " + endpoint);
  var apiCall = https.request(options, function(res){
    console.log("statusCode: ", res.statusCode);
    var data = "";
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
      onCharacterLoaded(JSON.parse(data));
    });
  });
  apiCall.end();

  res.send({"success": true});
});

module.exports = router;
