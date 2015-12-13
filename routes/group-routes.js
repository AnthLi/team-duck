var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

////// Start GET Requests

// Event scheduling page
router.get('/schedule', (req,res) => { 
  var user = req.session.user;
  var classid = req.query.classid;

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

router.post('/createPost', (req, res) => {
  var form = req.body;
  var classid = req.query.classid;
  var user = req.session.user;

  if (!form.title || !form.content) {
    req.flash('/class/'+ classid, 'Please fill out all fields');
    res.redirect('/class/'+classid);
    return;
  }

  db.createPost(user.spireid, form.title, form.content, classid, 
    (err, data) => {
    if (err) {
      req.flash('/class?classid=' + classid, err);
      res.redirect('/class?classid=' + classid);
      return;
    }

    req.flash('/class?classid=' + classid, 'Your post has been created!');
    res.redirect('/class?classid=' + classid);
  });
});

////// End POST Requests

module.exports = router;
