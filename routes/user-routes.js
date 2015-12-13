var express = require('express');

var db = require('../lib/database.js'); // Database library
var online = require('../lib/online').online; // List of online users
var user = require('../lib/user.js'); // User library

var router = express.Router(); // "Router" to separate particular points

////// Start GET Requests

// Login page
router.get('/login', (req, res) => {
  var user = req.session.user;

  if (user && online[user.uid]) {
    res.redirect('/index');
    return;
  }

  res.render('login', {
    title: 'Login',
    message: req.flash('login') || ''
  });
});

// Log the user out of their session
router.get('/logout', (req, res) => {
  var user = req.session.user;

  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('login');
    return;
  }

  if (user) {
    delete online[user.uid];
    delete req.session.user;
  }

  if (user && !online[user.uid]) {
    delete req.session.user;
  }

  req.flash('login', 'Successfully logged out!')
  res.redirect('login');
});

// Registration page
router.get('/registration', (req, res) => {
  res.render('registration', {
    title: 'Registration',
    message: req.flash('registration') || ''
  });
});

// Profile page
router.get('/profile', (req, res) => {
  var user = req.session.user;

  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('login');
    return;
  }

  if (user && !online[user.uid]) {
    delete req.session.user;
    req.flash('login', 'Login expired');
    res.redirect('login');
    return;
  }

  db.getProfile(user.spireid, (err, data) => {
    if (err) {
      return;
    }

    res.render('profile', {
      title: 'Profile',
      fname: user.fname,
      lname: user.lname,
      userID: user.spireid,
      data: data
    });
  });
});

////// End GET Requests

////// Start POST Requests

// Performs **basic** user authentication.
router.post('/auth', (req, res) => {
  var user = req.session.user;

  if (user && online[user.uid]) {
    res.redirect('/index');
    return;
  }

  var email = req.body.email;
  var pass = req.body.pass;

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

    online[user.uid] = user; // Add user to map of online users
    req.session.user = user; // Create session variable
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

  // Verify that the email is a university email
  if (form.email.indexOf('umass.edu') < 0) {
    req.flash('registration', 'The email is not valid!');
    res.redirect('registration');
    return;
  }

  // Check if the user is banned
  db.isBanned(form.email, (err, data) => {
    if (err) {
      req.flash('registration', err);
      res.redirect('registration');
      return;
    }

    // The email was not in the blacklist; available to complete registration
    if (!data) {
      // Add the user to the database
      db.addUser(user(form.major, form.year, form.fname, form.lname, form.email,
        form.pass, form.dob, form.spireid), (err, data) => {
        if (err) {
          req.flash('registration', err);
          res.redirect('registration');
          return;
        }

        // The user was found in the database, no need to add them again  
        if (data.rowCount === 0) {
          req.flash('registration', 'This email is already registered!');
          res.redirect('registration');
          return;
        }

        req.flash('login', 'Your account has been created!');
        res.redirect('login');
      });

      return;
    }

    req.flash('registration', 'This email has been banned!');
    res.redirect('registration');
  });

  
});

// Update the about section for a specific user
router.post('/update', (req, res) => {
  db.updateAbout(req.body.about, user.spireid, (err, data) => {
    if (err) {
      req.flash('profile', err);
      res.redirect('profile');
      return;
    }

    req.flash('/profile', 'About has been updated');
    res.redirect('/profle');
  });
});

// Adds a user class to 'students' table in database
router.post('/addClass', (req,res) => {
  var user = req.session.user;
  var num = req.body.values.split(', ')[1]; // Get the class number

  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('login');
    return;
  }

  //Check if login has expired
  if (user && !online[user.uid]) {
    delete req.session.user;
    req.flash('login', 'Login expired');
    res.redirect('login');
    return;
  }

  db.joinClass(num, user.spireid, (err,data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    res.redirect('/index');
  });
});

////// End POST Requests

module.exports = router;
