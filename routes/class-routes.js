var express = require('express');
var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var sessionCheck = require('../lib/sessionCheck.js') // Session checking library
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

//// Start GET Requests

// Dynamic route for every class page based on the query string
router.get('/', (req, res) => {
  var user = req.session.user;
  var classid = req.query.classid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  // Get the details about the class
  db.getClassDetails(classid, (err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    // Get the events for the class
    db.getEventsByClass(classid, (err, events) => {
      if (err) {
        res.redirect('/index');
        return;
      }

      res.render('class', {
        fname: user.fname,
        lname: user.lname,
        userID: user.spireid,
        num: data[0].num,
        students: data[0].students,
        eid: data[0].eid,
        events: events,
        classid: classid,
      });
    });
  });
});

// Get the details for a specific event in the class
router.get('/content', (req, res) => {
  var user = req.session.user;
  var classid = req.query.classid;
  var eid = req.query.eid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  db.getEventDetails(classid, eid, (err, data) => {
    if (err) {
      res.redirect(req.header('Referer'));
      return;
    }

    res.render('event', {
      data: data
    });  
  });
});

// Delete a class based on the classid
router.get('/delete', (req, res) => {
  var classid = req.query.classid;
  var user = req.session.user;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
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