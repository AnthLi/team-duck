var express = require('express');

var db = require('../lib/database.js');
var online = require('../lib/online').online; // List of online users

var router = express.Router(); // "Router" to separate particular points

// Performs **basic** user authentication.
router.post('/auth', (req, res) => {
  var user = req.session.user;
  if (user && online[user]) {
    res.redirect('/user/main');
  } else {
    var email = req.body.email;
    var pass = req.body.pass;

    if (!email || !pass) {
      req.flash('login', 'Invalid credentials');
      res.redirect('login');
    } else {
      db.lookup(email, pass, function(err, user) {
        if (err) {
          req.flash('login', error);
          res.redirect('login');
        } else {
          online[user.name] = user;
          req.session.user = user;
          req.flash('main', 'Authentication successful');
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

module.exports = router;
