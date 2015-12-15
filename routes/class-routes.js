var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var sessionCheck = require('../lib/sessionCheck.js') // Session checking library
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

////// Start GET Requests

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

      db.getPostsByClass(classid, (err, posts) => {
        if (err) {
          res.redirect('/index');
          return;
        }

        db.getPersonalClasses(user.spireid, (err, classes) => {
          if (err) {
            res.redirect('/index');
            return;
          }

          res.render('class', {
            fname: user.fname,
            lname: user.lname,
            spireid: user.spireid,
            num: data[0].num,
            students: data[0].students,
            eid: data[0].eid,
            events: events,
            posts: posts,
            classid: classid,
            classes: classes
          });
        });
      });
    });
  });
});

//Get students in a class
router.get('/students', (req,res) => {
  var user = req.session.user;
  var classid = req.query.classid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  db.getClassDetails(classid, (err, data) => {
    if (err) {
      return;
    }
  
    res.render('students', {
      title: 'Students',
      fname: user.fname,
      lname: user.lname,
      spireid: user.spireid,
      classid: classid,
      classData: data
    });
  });
});

// Get the details for a specific event in the class
router.get('/content', (req, res) => {
  var user = req.session.user;
  var classid = req.query.classid;
  var eid = req.query.eid;
  var pid = req.query.pid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  // Query string contains an event id
  if (eid) {
    db.getEventDetails(classid, eid, (err, data) => {
      if (err) {
        res.redirect(req.header('Referer'));
        return;
      }

      db.eventStats(eid, (err, stats) => {
        if (err) {
          res.redirect(req.header('Referer'));
          return;
        }

        res.render('event', {
          fname: user.fname,
          lname: user.lname,
          spireid: user.spireid,
          classid: classid,
          eid: eid,
          data: data,
          stats: stats
        });
      })
    });
    
    return;
  }
  
  // Query string contains a post id
  if (pid) {
    db.getPostDetails(classid, pid, (err, data) => {
      if (err) {
        res.redirect(req.header('Referer'));
        return;
      }

      db.getComments(pid, (err, comments) => {
        if (err) {
          res.redirect(req.header('Referer'));
          return;
        }

        res.render('post', {
          fname: user.fname,
          lname: user.lname,
          spireid: user.spireid,
          data: data,
          classid: classid,
          pid: pid,
          comments: comments
        });
      });
    });
  }
});

// Delete a class based on the classid
router.get('/delete', (req, res) => {
  var user = req.session.user;
  var classid = req.query.classid;
  
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
