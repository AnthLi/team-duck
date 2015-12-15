var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var sessionCheck = require('../lib/sessionCheck.js') // Session checking library
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

////// Start GET Requests

// Event creation page
router.get('/createEvent', (req,res) => { 
  var user = req.session.user;
  var classid = req.query.classid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  res.render('createEvent', { 
    title: 'Create an Event',
    fname: user.fname,
    lname: user.lname,
    classid : classid,
    spireid: user.spireid,
    message: req.flash('createEvent') || ''
  });
});

// Post creation page
router.get('/createPost', (req,res) => { 
  var user = req.session.user;
  var classid = req.query.classid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  res.render('createpost', { 
    title: 'Submit a Post',
    fname: user.fname,
    lname: user.lname,
    spireid: user.spireid,
    classid : classid,
    message: req.flash('createPost') || ''
  });
});

// Attend an event posted
router.get('/attendEvent', (req, res) => {
  var user = req.session.user;
  var classid = req.query.classid;
  var eid = req.query.eid;
  
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  db.attendEvent(eid, user.spireid, (err, data) => {
    if (err) {
      res.redirect(req.header('Referer'));
      return;
    }

    res.redirect('/class/content?classid=' + classid + '&eid=' + eid);
  });
});

// Ignore an event posted
router.get('/ignoreEvent', (req, res) => {
  var user = req.session.user;
  var classid = req.query.classid;
  var eid = req.query.eid;
  
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  db.ignoreEvent(eid, user.spireid, (err, data) => {
    if (err) {
      res.redirect(req.header('Referer'));
      return;
    }

    res.redirect('/class/content?classid=' + classid + '&eid=' + eid);
  });
});

////// End GET Requests

////// Start POST Requests

// Send event creation data
router.post('/createEvent', (req, res) => {
  var user = req.session.user;
  var form = req.body;
  var classid = req.query.classid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  // Check if the form contains any empty fields
  if (!form.anonymity | !form.title | !form.description | !form.location | 
    !form.date | !form.time) {
    req.flash('createEvent', 'Please fill out all fields');
    res.redirect(req.header('Referer'));
    return;
  }

  db.createEvent(form.anonymity, form.title, form.description, form.location, 
    form.date + ' ' + form.time, classid, user.spireid, (err, data) => {
    if (err) {
      req.flash('createEvent', err);
      res.redirect(req.header('Referer'));
      return;
    }
    
    res.redirect('/class?classid=' + classid);
  });
});

// Send post creation data
router.post('/createPost', (req, res) => {
  var user = req.session.user;
  var form = req.body;
  var classid = req.query.classid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  // Check if the form contains any empty fields
  if (!form.anonymity | !form.title | !form.content) {
    req.flash('createPost', 'Please fill out all fields');
    res.redirect(req.header('Referer'));
    return;
  }

  db.createPost(form.anonymity, user.spireid, classid, form.title, form.content, 
    (err, data) => {
    if (err) {
      req.flash('createPost', err);
      res.redirect(req.header('Referer'));
      return;
    }
    
    res.redirect('/class?classid=' + classid);
  });
});

router.post('/postComment', (req, res) => {
  var user = req.session.user;
  var form = req.body;
  var pid = req.query.pid;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  db.getCID(pid, (err, cid) => {
    if (err) {
      res.redirect('/class/content?classid=' + cid + '&' + 'pid=' + pid);
    }

    // uid, pid, cid, content,cb
    db.postComment(pid, form.content, form.anonymity, user.spireid, 
      (err, data) => {
      if (err) {
        res.redirect('/class/content?classid=' + cid + '&' + 'pid=' + pid);
        return;
      }

      res.redirect('/class/content?classid=' + cid + '&' + 'pid=' + pid);
    });
  });
});

//Flags post
router.post('/flagPost', (req, res) => {
  var user = req.session.user;
  var pid = req.query.pid;
  var reportee_id = req.query.ri;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  db.postFlag(pid, user.spireid, (err, data) => {
    if (err) {
      res.redirect(req.header('Referer'));
      return;
    }

    db.incrementFlag(reportee_id, (err, data) => {
      if (err) {
        return;
      }
      
      res.redirect(req.header('Referer'));
    });
  });
});

//Flags comment
router.post('/flagComment', (req, res) => {
  var user = req.session.user;
  var cid = req.query.cid;
  var reportee_id = req.query.ri;

  // The user session either doesn't exist, or it expired
  if (!sessionCheck(user, online, req, res)) {
    return;
  }

  db.commentFlag(cid, user.spireid, (err, data) => {
    if (err) {
      res.redirect(req.header('Referer'));
      return;
    }
    
    db.incrementFlag(reportee_id, (err, data) => {
      if (err) {
        console.log("1 : " + err);
        return;
      }

      res.redirect(req.header('Referer'));
    });
  });
});


////// End POST Requests

module.exports = router;
