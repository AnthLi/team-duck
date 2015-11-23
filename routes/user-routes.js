var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

// Login page
router.get('/login', (req, res) =>{
  var user = req.session.user;

  // The user is already logged in
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

  // The user session expired
  if (user && !online[user.name]) {
    delete req.session.user; // Delete only the user from the session
  } else if (user) {
    // Delete from map of online users and the session
    delete online[user.name];
    delete req.session.user;
  }

  res.redirect('login'); // Redirect to login regardless.
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

  var email = req.body.email; // Email of the user
  var pass = req.body.pass; // Password of the user

  // Either the email, password, or both are empty
  if (!email || !pass) {
    req.flash('login', 'Invalid credentials');
    res.redirect('login');
    return;
  }

  // Authorize the user's credentials
  db.authorizeUser(email, pass, (err, user) => {
    if (err) {
      req.flash('login', err);
      res.redirect('login');
      return;
    }

    online[user.email] = user; // Add user to map of online users
    req.session.user = user; // Create session variable
    req.flash('index', 'Login successful');
    res.redirect('/index');
  });
});

// Account creation
router.post('/register', (req, res) => {
  var form = req.body;

  // Check if the user did not fill out the entire form
  if (!form.fname | !form.lname | !form.email | !form.pass | !form.dob) {
    req.flash('registration', 'Please fill out all fields');
    res.redirect('registration');
    return;
  }

  // Check if the user is already in the database
  db.lookupUser(form.email, (err, data) => {
    if (err) {
      // The user was not found in the datbase, free to add them
      db.addUser(user(form.fname, form.lname, form.email, form.pass, form.dob), 
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

    // The user was found in the database, no need to add them again
    req.flash('registration', 'An account for this email already exists!');
    res.redirect('registration');
  });
});

module.exports = router;
