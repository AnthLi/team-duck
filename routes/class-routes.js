var express = require('express');
var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

router.get('/:class', (req, res) => {
  var class_id = req.params.class;
  db.classLookup(class_id, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    
    res.render('classes', { 
      classes: data
    });
  });
});

module.exports = router;
