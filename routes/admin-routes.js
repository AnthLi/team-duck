var express = require('express');

// var online = require('../lib/online').online; // List of online users

var router = express.Router(); // "Router" to separate particular points

router.get('/online', function(req, res) {
  // Grab the user session if it exists
  var user = req.session.user;

  // If no session, redirect to login
  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
  } else {
    res.render('online', {
      title: 'Online Users',
      online: online
    });
  }
});

router.get('/admin', function(req, res){
  var user = req.session.user;

  if(!admin){
      req.flash('login', 'Not logged in');
      res.redirect('/user/login');
    } else if(admin && !online[admin.name]){
      // Server has been restarted
      req.flash('login', 'Login expired');
      delete req.session.user;
      res.redirect('/user/login');
    } else if(admin.admin == false){
      req.flash('main', "You don't have the proper admin credentials to access this route");
      res.redirect('/user/main');
    } else { 
      // User is an admin
      res.render('admin', '');
    }
});

module.exports = router;
