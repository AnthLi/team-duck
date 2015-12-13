var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var sessionCheck = require('../lib/sessionCheck.js') // Session checking library
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

////// Start GET Requests

// Event scheduling page
router.get('/schedule', (req,res) => { 
  var user = req.session.user;
  var classid = req.query.classid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  res.render('schedule', { 
    title: 'Create an Event',
    fname: user.fname,
    lname: user.lname,
    classid : classid,
    userID: user.spireid,
    message: req.flash('schedule') || ''
  });
});

////// End GET Requests

////// Start POST Requests

// Event creation
router.post('/createEvent', (req, res) => {
  var form = req.body;
  var classid = req.query.classid;
  var user = req.session.user;

  if (!form.anonymity | !form.title | !form.description | !form.location | 
    !form.date, !form.time) {
    req.flash('schedule/' + classid, 'Please fill out all fields');
    res.redirect('schedule');
    return;
  }

  db.createEvent(form.anonymity, form.title, form.description, form.location, 
    form.date + ' ' + form.time, classid, user.spireid, (err, data) => {
    if (err) {
      req.flash('schedule?classid='+ classid, err);
      res.redirect('schedule');
      return;
    }
    
    req.flash('/class?classid=' + classid, 'Your event has been created!');
    res.redirect('/class?classid=' + classid);
  });
});

////// End POST Requests

module.exports = router;