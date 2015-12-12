var express = require('express');
var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

////// Start GET Requests

router.get('/:class', (req, res) => {
  var classid = req.params.class;
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

  db.getClassDetails(classid, (err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    res.render('class', { 
      num: data[0].num,
      students: data[0].students
    });
  });
});

////// End GET Requests

////// Start POST Requests

router.post('/delete', (req, res) => {
  var classid = req.params.class;
  var user = req.session.user;

  console.log(classid);
  console.log(user);

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

  db.leaveClass(classid, user.spireid, (err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    res.render('/index');
  });

});

////// End POST Requests

module.exports = router;
