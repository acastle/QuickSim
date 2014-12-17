var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var sim = require("../modules/sim");

router.get('/:realm/:name', function(req, res) {
  var regexp = /^(\W|_)/;
  if (regexp.match(req.params.name) || regexp.match(req.params.realm)){
    res.send({"queued": false});
    return;
  }

  sim.simulate({realm:req.params.realm, name:req.params.name});
  res.send({"queued":true});
});

module.exports = router;