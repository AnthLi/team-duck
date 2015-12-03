var express = require('express');

var online = require('../lib/online').online; // List of online users
var db = require('../lib/database.js');
var router = express.Router(); // "Router" to separate particular points

// Verification process to see if the user is logged in and/or online
function verify(user, req, res) {
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

// Verification to see if the current user is a dev
// Devs are the only admins
function verifyAdmin(data, user) {
  var admin = false;

  // If the current user is not a dev, they are not an admi
  for (var i = 0; i < data.length; i++) {
    if (user.email == data[i].email) {
      admin = true;
    }
  }

  return admin;
}

////// Start GET Requests

// List of online users
router.get('/online', (req, res) => {
  var user = req.session.user;

  if (!verify(user, req, res)) {
      return;
  }

  db.team((err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    if (!verifyAdmin(data, user)) {
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

  if (!verify(user, req, res)) {
    return;
  }

  db.team((err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    if (!verifyAdmin(data, user)) {
      res.redirect('/index');
      return;
    }

    db.users((err, data) => {
      if (err) {
        req.flash('userList', err);
        res.redirect('userList');
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

  if (!verify(user, req, res)) {
    return;
  }

  db.team((err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    if (!verifyAdmin(data, user)) {
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

  if (!verify(user, req, res)) {
    return;
  }

  db.team((err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    if (!verifyAdmin(data, user)) {
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

  if (!verify(user, req, res)) {
    return;
  }

  db.team((err, data) => {
    if (err) {
      res.redirect('/index');
      return;
    }

    if (!verifyAdmin(data, user)) {
      res.redirect('/index');
      return;
    }

    var email = req.body.email;

    db.authorizeAdmin(email, (err, user) => {
      if (err) {
        res.redirect('/index');
        return;
      }

      res.redirect('controls');
    });
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
