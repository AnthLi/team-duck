var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

// Login page
router.get('/login', (req, res) =>{
  var user = req.session.user;

  if (user && online[user.name]) {
    res.redirect('/index');
    return;
  }

  res.render('login', { 
    title: 'Login',
    message: req.flash('login') || ''
  });
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
  res.render('registration', {
    title: 'Registration',
    message: req.flash('registration') || ''
  });
});

// Performs **basic** user authentication.
router.post('/auth', (req, res) => {
  var user = req.session.user;

  if (user && online[user]) {
    res.redirect('/index');
    return;
  }

  var email = req.body.email;
  var pass = req.body.pass;

  if (!email || !pass) {
    req.flash('login', 'Invalid credentials');
    res.redirect('login');
    return;
  }

  db.authorize(email, pass, (err, user) => {
    if (err) {
      req.flash('login', err);
      res.redirect('login');
      return;
    }

    online[user.email] = user;
    req.session.user = user;
    req.flash('index', 'Login successful');
    res.redirect('/index');
  });
});

// Account creation
router.post('/register', (req, res) => {
  var form = req.body;

  // Check if the user is already in the database.
  // If there is an error when looking, then the user does not exist
  // and can be created.
  db.lookup(form.email, (err, data) => {
    if (err) {
      db.add(user(form.fname, form.lname, form.email, form.pass, form.dob), 
        (err, data) => {
        if (err) {
          req.flash('registration', err);
          res.redirect('registration');
          return;
        }

        req.flash('login', 'Your account has been created!');
        res.redirect('login');
      });

      return;
    }

    req.flash('registration', 'An account for this email already exists!');
    res.redirect('registration');
  });
});

module.exports = router;
