var express = require('express');
var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

router.get('/:class', (req, res) => {
  var class_id = req.params.class;
  var user = req.session.user;

  if (!user) {
      req.flash('login', 'Not logged in');
      res.redirect('/user/login');
      return;
  }

  if (user && !online[user.uid]) {
    delete req.session.user;
    req.flash('login', 'Login expired');
    res.redirect('/user/login');
    return;
  }

  db.classLookup(class_id, (err, data) => {
    if(err){
      console.log("err: " + err);
      return;
    }
    
    res.render('classes', { 
      classes: data,
    });
  });
});

module.exports = router;
