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
      res.redirect('/index');
      return;
    }

    res.render('online', {
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
      res.redirect('/index');
      return;
    }

    db.users((err, data) => {
      if (err) {
        res.redirect('controls');
        return;
      }

      res.render('userList', {
        title: 'Users in Database',
        users: data
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
      res.redirect('/index');
      return;
    }

    res.render('adminControls', {
      title: 'Admin Controls'
    });
  });
});

// List of all classes
router.get('/classes', (req, res) => {
  var user = req.session.user;

  if (!session(user, req, res)) {
    return;
  }

  db.authorizeAdmin(user.email, (err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    res.render('classes', {
      title: 'Classes'
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
router.post('/ban/:user_email', (req,res) => {
  db.deleteUser(req.params.user_email, (err) => {
    if (err) {
      req.flash('userList', err);
      res.redirect('userList');
      return;
    }

    req.flash('userList' ,'deleted user: ' + req.params.user_email);
    res.redirect('userList');
  });
});

////// End POST Requests

module.exports = router;
