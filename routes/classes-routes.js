var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

////// Start GET Requests

// Login page
router.get('/classes', (req, res) => {
  var user = req.session.user;

  db.getClassID((err, data) => {
    if (err) {
      notFound404(req, res);
      return;
    }
  	res.render('classes', { 
    	classes: data
  	});
  });
});

module.exports = router;