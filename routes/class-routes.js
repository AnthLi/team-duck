var express = require('express');
var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

//// Start GET Requests
router.get('/:classid', (req, res) => {
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

      db.getClassDetails(classid, (err, data) => {
            if (err) {

              req.flash('index', err);
              res.redirect('/index');
              return;
            }
            db.getEventsByClass(classid, (err, events) => {
                  if(err) {
                     req.flash('index', err);
                    res.redirect('/index');
                    return;
                  }

                  db.getPostsByClass(classid, (err, posts) => {

                      if(err) {
                        console.log(err);
                        req.flash('class', err);
                        res.render('class', {
                          // classID: classid,
                          fname: user.fname,
                          lname: user.lname,
                          userID: user.spireid,
                          num: data[0].num,
                          students: data[0].students,
                          events : events,
                        });
                        return;
                      }
                      // console.log(posts);
                      // console.log(data[0].students[0]);
                      // console.log(data[0].num);
                      // console.log(events[0]);

                      res.render('class', {
                      classID: classid,
                      fname: user.fname,
                      lname: user.lname,
                      userID: user.spireid,
                      num: data[0].num,
                      students: data[0].students,
                      events : events,
                      posts: posts
                  });
                  })
            // res.render('class', { 
            //   num: data[0].num,
            //   students: data[0].students,

            // });
          });
     });


// Dynamic route for every class page
router.get('/', (req, res) => {
  var user = req.session.user;
  var query = req.query; // Get the query string
  var classid = req.query.classid; // Get the classid from the query string
  
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

// Get the details for a specific event
router.get('/content', (req, res) => {
  var classid = req.query.classid;
  var eid = req.query.eid;

  res.render('event', {
    classid: classid,
    eid: eid
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

////// End GET Requests

////// Start POST Requests



////// End POST Requests

module.exports = router;
