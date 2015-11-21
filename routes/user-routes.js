var express = require('express');

var db = require('../lib/database.js');
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js');

var router = express.Router(); // "Router" to separate particular points

// Performs **basic** user authentication.
router.post('/auth', (req, res) => {
  var user = req.session.user;

  if (user && online[user]) {
    res.redirect('/home');
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
          res.render('/home');
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
 
// Registration page
router.get('/registration', (req, res) => {
  res.render('register');
});

// Account creation
router.post('/register', (req, res) => {
  var form = req.body;

  db.add(user(form.fname, form.lname, form.email, form.pass, form.dob), 
    (err, data) => {
    if (err) {
      req.flash('registration', err);
      res.redirect('registration');
    } else {
      res.redirect('/home');
    }
  });
});

module.exports = router;
