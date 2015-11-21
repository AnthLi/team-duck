var express = require('express');

var db = require('../lib/database.js');
var online = require('../lib/online').online; // List of online users

var router = express.Router(); // "Router" to separate particular points

// Performs **basic** user authentication.
router.post('/auth', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user]) {
    res.redirect('/user/main');
  } else {
    // Pull the values from the form
    var name = req.body.name;
    var pass = req.body.pass;

    if (!name || !pass) {
      req.flash('login', 'did not provide the proper credentials');
      res.redirect('login');
    } else {
      db.lookup(name, pass, function(error, user) {
        if (error) {
          // Pass a message to login:
          req.flash('login', error);
          res.redirect('login');
        } else {
          // add the user to the map of online users:
          online[user.name] = user;

          // create a session variable to represent stateful connection
          req.session.user = user;

          // Pass a message to main:
          req.flash('main', 'authentication successful');
          res.redirect('/user/main');
        }
      });
    }
  }
});

router.get('/login', (req, res) =>{
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    res.redirect('main');
  } else {
    // Grab any messages being sent to us from redirect:
    var message = req.flash('login') || '';
    res.render('login', { 
      title: 'User Login',
      message: message
    });
  }
});

router.get('/logout', function(req, res) {
  // Grab the user session if logged in.
  var user = req.session.user;

  // If the client has a session, but is not online it
  // could mean that the server restarted, so we require
  // a subsequent login.
  if (user && !online[user.name]) {
    delete req.session.user;
  }
  // Otherwise, we delete both.
  else if (user) {
    delete online[user.name];
    delete req.session.user;
  }

  // Redirect to login regardless.
  res.redirect('login');
});

router.get('/main', function(req, res) {
  // Grab the user session if it exists:
  var user = req.session.user;

  // If no session, redirect to login.
  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('login');
  } else if (user && !online[user.name]) {
    req.flash('login', 'Login Expired');
    delete req.session.user;
    res.redirect('login')
  } else {    
    // capture the user object or create a default.
    var message = req.flash('main') || 'Login Successful';
    res.render('layouts/main', {
      title: 'User Main',
      message: message,
      name: user.name });
  }
});

// Home Page
router.get('/home', (req, res) => {
  var user = req.session.user;
  res.render('home', {title: "Home Screen"});
  ///****************Todo: add checks
});

// About page
router.get('/about', (req, res) => {
  console.log("butss");
  res.render('about');
});

// Team page
router.get('/team', (req, res) => {
  // Array of each team member
  var members = ['apli', 'bcheung', 'hkeswani', 'jgatley', 'zmilrod'];
  var member = req.query.user; // Get the user from the query string
  var Mem = team.all().data;
  var single = team.one(member).data;

  /* 
  If there is a user in the query and they are a valid user, 
  render the handlebars for that user.
  If the user is not a team member -> 404 error.
  Otherwise, refer to the main team page.
  */
  if (member && members.indexOf(member) >= 0) {
    res.render('members', {
      memberx: single[0]
    });
  } else if (member && members.indexOf(member) < 0) {
    notFound404(req, res);
  } else {
    res.render('team', {
      members: Mem
    });
  }
});

module.exports = router;
