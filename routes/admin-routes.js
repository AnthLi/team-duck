var express = require('express');

var online = require('../lib/online').online; // List of online users
var db = require('../lib/database.js');
var router = express.Router(); // "Router" to separate particular points

// Verification process to see if the user is logged in and/or online
function session(user, req, res) {
  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
    return false;
  }

  if (user && !online[user.uid]) {
    req.flash('login', 'Login expired');
    delete req.session.user;
    res.redirect('/user/login');
    return false;
  }

  return true;
}

////// Start GET Requests

// List of online users
router.get('/online', (req, res) => {
  var user = req.session.user;

  if (!session(user, req, res)) {
    return;
  }

  db.authorizeAdmin(user.email, (err, data) => {
    if (err) {
      res.redirect(req.header('Referer'));  // Redirect to the previous page
      return;
    }

    res.render('online', {
      fname: user.fname,
      lname: user.lname,
      spireid: user.spireid,
      title: 'Online Users',
      online: online
    });
  });
});

// List of all users in the database and their attributes
router.get('/users', (req, res) => {
  var user = req.session.user;

  if (!session(user, req, res)) {
    return;
  }

  db.authorizeAdmin(user.email, (err, data) => {
    if (err) {
      res.redirect(req.header('Referer'));  // Redirect to the previous page
      return;
    }

    db.users((err, data) => {
      if (err) {
        res.redirect('controls');
        return;
      }

      res.render('users', {
        fname: user.fname,
        lname: user.lname,
        spireid: user.spireid,
        title: 'Users in Database',
        users: data,
        message: req.flash('users') || ''
      });
    });
  });
});

// Admin controls page
router.get('/controls', (req, res) => {
  var user = req.session.user;

  if (!session(user, req, res)) {
    return;
  }

  db.authorizeAdmin(user.email, (err, data) => {
    if (err) {
      res.redirect(req.header('Referer'));  // Redirect to the previous page
      return;
    }

    res.render('adminControls', {
      fname: user.fname,
      lname: user.lname,
      spireid: user.spireid,
      title: 'Admin Controls'
    });
  });
});

////// End GET Requests

////// Start POST Requests

// Admin authorization
router.post('/auth', (req, res) => {
  var user = req.session.user;

  if (!session(user, req, res)) {
    return;
  }

  db.authorizeAdmin(user.email, (err, data) => {
    if (err) {
      res.redirect(req.header('Referer')); // Redirect to the previous page
      return;
    }

    res.redirect('controls');
  });
});

// Banhammer
router.post('/ban', (req,res) => {
  var email = req.query.email;
  console.log(email);

  db.deleteUser(email, (err) => {
    if (err) {
      req.flash('users', err);
      res.redirect('users');
      return;
    }

    req.flash('users' ,'Deleted user ' + email);
    res.redirect('users');
  });
});

////// End POST Requests

module.exports = router;
