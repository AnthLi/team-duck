var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

function notFound404(req, res) {
  res.status(404);
  res.render('404');
}

////// Start GET Requests

// Login page
router.get('/classes', (req, res) => {
  db.GetClassDetails(id, (err, data) => {
    if (err) {
      console.log(err);
      console.log(id);
      notFound404(req, res);
      return;
    }
  	res.render('classes', { 
    	classes: data
  	});
  });
});

module.exports = router;