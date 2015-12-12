var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

////// Start GET Requests

// Schedule page
router.get('/schedule', (req, res) => {
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

  res.render('schedule', { 
    title: 'Create an Event',
    fname: user.fname,
    lname: user.lname,
    userID: user.spireid,
    message: req.flash('schedule') || ''
  });
});

////// End GET Requests

////// Start POST Requests

// Event creation
router.post('/createEvent', (req, res) => {
  var form = req.body

  if (!form.anonymity | !form.title | !form.description | !form.location | 
    !form.date, !form.time) {
    req.flash('schedule', 'Please fill out all fields');
    res.redirect('schedule');
    return;
  }

  db.createEvent(form.anonymity, form.title, form.description, form.location, 
    form.date + ' ' + form.time, (err, data) => {
    if (err) {
      req.flash('schedule', err);
      res.redirect('schedule')
      return;
    }

    req.flash('schedule', 'Your event has been created!');
    res.redirect('schedule');
  });
});

// router.post('/updateAttending', (req, res) => {
//   db.updateAttending()
// });

////// End POST Requests

module.exports = router;