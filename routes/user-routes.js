var express = require('express');

var db = require('../lib/database.js');
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js');

var router = express.Router(); // "Router" to separate particular points

//account creation
router.post('/signup', (req, res) => {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var pass = req.body.pass;
  var dob = req.body.dob;

  db.add(user(fname, lname, email, pass, dob), () => {});
  res.redirect('/home');
});

// Performs **basic** user authentication.
router.post('/auth', (req, res) => {
  var user = req.session.user;

  if (user && online[user]) {
    res.redirect('/user/main');
  } else {
    var email = req.body.email;
    var pass = req.body.pass;

    if (!email || !pass) {
      req.flash('login', 'did not provide the proper credentials');
      res.redirect('/user/login');
    } else {
      db.lookup(email, pass, (err, user) => {
        if (err) {
          req.flash('login', err);
          res.redirect('/login');
        } else {
          online[user.email] = user;
          req.session.user = user;
          res.render('/about');
        }
      });
    }
  }
});

// Login page
router.get('/login', (req, res) =>{
  var user = req.session.user;

  if (user && online[user.name]) {
    res.redirect('/home');
  } else {
    var message = req.flash('login') || '';
    res.render('login', { 
      title: 'User Login',
      message: message
    });
  }
});

// Log the user out of their session
router.get('/logout', function(req, res) {
  var user = req.session.user;

  // If the client has a session, but is not online it
  // could mean that the server restarted, so a subsequent login is required.
  // Otherwise, delete both.
  if (user && !online[user.name]) {
    delete req.session.user;
  } else if (user) {
    delete online[user.name];
    delete req.session.user;
  }

  // Redirect to login regardless.
  res.redirect('login');
});

module.exports = router;
