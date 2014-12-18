var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var sim = require("../modules/sim");

router.get('/', function(req, res) {
  if (/\W/.test(req.query.name) || /^(\w|')+$/.test(req.query.realm) == false){
    res.send({"queued": false});
    return;
  }

  sim.simulate({realm:req.query.realm, name:req.query.name});
  res.send({"queued":true});
});

module.exports = router;