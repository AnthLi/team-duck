var express = require('express');
var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

//// Start GET Requests

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
      console.log(err);
      res.redirect('/index');
      return;
    }
    db.getEventsByClass(classid, (err, events) => {
          if(err) {
            console.log(err);
            res.redirect('/index');
            return;
          }
          res.render('class', {
              fname: user.fname,
              lname: user.lname,
              userID: user.spireid,
              num: data[0].num,
              students: data[0].students,
              events : events,
              classid : classid

          });
     });
  });
});

router.get('/content', (req, res) => {
  var classid = req.session;

  console.log(classid);

  res.redirect(req.header('Referer'));
});

// Delete a class based on the classid
router.get('/delete/:classid', (req, res) => {
  var classid = req.params.classid;
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

  db.leaveClass(classid, user.spireid, (err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    res.redirect('/index');
  });
});

////// End GET Requests

////// Start POST Requests



////// End POST Requests

module.exports = router;
