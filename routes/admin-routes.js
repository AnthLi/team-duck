var express = require('express');

var online = require('../lib/online').online; // List of online users
var db = require('../lib/database.js');
var router = express.Router(); // "Router" to separate particular points


// List of online users
router.get('/online', function(req, res) {
  var user = req.session.user;

  // The user session does not exist, redirect to login
  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
    return;
  } 

  res.render('online', {
    title: 'Online Users',
    online: online
  });
});

router.post('/ban/:user_email', function(req,res) {
  db.deleteUser(req.params.user_email, (err) => {
    if(err){
      req.flash('userList', err);
      res.redirect('userList');
      return;
    }
    req.flash('userList' ,'deleted user: ' + req.params.user_email);
    res.redirect('userList');
  });
});

router.get('/userList', function(req, res) {
  var user = req.session.user;

  if(!user){
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
    return;
  }
   if (!user.admin) {
    req.flash('index', "Invalid admin credentials");
    res.redirect('/index');
    return;
  }
  db.users( (err, data) => {
     if (err) {
          req.flash('userList', err);
          res.redirect('/userList');
          return;
        }
      res.render('/userList', {
        title : 'Users in Database',
        users : data
      })
  });

});

router.get('/adminControls', (req, res) =>{

  var user = req.session.user;

  if(!user){
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
    return;
  }
   if (!user.admin) {
    req.flash('index', "Invalid admin credentials");
    res.redirect('/index');
    return;
  }

  res.render('adminControls', {title: 'Admin Controls'});

});

// Admin authorization
router.get('/auth', function(req, res){
  var user = req.session.user;

  // The user session does not exist
  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
    return;
  }
  // The user session expired
  if (user && !online[user.name]) {
    req.flash('login', 'Login expired');
    delete req.session.user;
    res.redirect('/user/login');
    return;
  }
  // The user is not an admin
  if (!user.admin) {
    req.flash('index', "Invalid admin credentials");
    res.redirect('/index');
    return;
  }
    
  res.render('admin', ''); // The user is an admin
});

module.exports = router;
