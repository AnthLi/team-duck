var express = require('express');
var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

//// Start GET Requests

// Dynamic route for every class page based on the query string
router.get('/', (req, res) => {
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

        res.render('class', {
          fname: user.fname,
          lname: user.lname,
          userID: user.spireid,
          num: data[0].num,
          students: data[0].students,
          eid: data[0].eid,
          events: events,
          posts: posts,
          classid: classid
        });
      });
    });
  });
});

// Get the details for a specific event
router.get('/content', (req, res) => {
  var classid = req.query.classid;
  var eid = req.query.eid;

  db.getEventDetails(classid, eid, (err, data) => {
    if (err) {
      res.redirect('/');
      return;
    }
  });

  res.render('event', {
    classid: classid,
    eid: eid
  });
});

// Delete a class based on the classid
router.get('/delete', (req, res) => {
  var classid = req.query.classid;
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

router.get('/Post', (req, res) => {
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
  db.getPostsByClass(classid, (err, posts) => {
      if(err){
        req.flash('/class/'+classid , err);  
        res.redirect('/class/' + classid);
        return;
    
      }
      res.render('createpost', { 
        title: 'Make a Post',
        fname: user.fname,
        lname: user.lname,
        classid : classid,
        userID: user.spireid,
        posts : posts,
        message: req.flash('schedule') || ''
      });
  });
});



});

////// End GET Requests

////// Start POST Requests

router.post('/createPost', (req, res) => {
  var form = req.body;
  var classid = req.query.classid;
  var user = req.session.user;

  if (!form.anonymity | !form.title | !form.content ) {
    req.flash('Post?classid=' + classid, 'Please fill out all fields');
    res.redirect('Post?classid=' + classid);
    return;
  }

  db.createPost(user.spireid, form.title, form.content, classid, (err, data) => {
    if (err) {
      req.flash('Post?classid='+ classid, err);
      res.redirect('Post?classid='+classid);
      return;
    }
    req.flash('/class?classid=' + classid, 'Your Post has been made');
    res.redirect('/class?classid=' + classid);
  });
});

////// End POST Requests

module.exports = router;
