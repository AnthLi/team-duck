var express = require('express');

// A list of users who are online:
// var online = require('./app.js').online;

// This creates an express "router" that allows us to separate
// particular routes from the main application.
var router = express.Router();


router.get('/online', function(req, res) {
  // Grab the user session if it exists:
  var user = req.session.user;

  // If no session, redirect to login.
  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
  }
  else {
    res.render('online', {
      title : 'Online Users',
      online: online
    });
  }
});

router.get('/admin', function(req, res){

	var user = req.session.user;

	if(!admin){
    	req.flash('login', 'Not logged in');
    	res.redirect('/user/login');
  	}
  	else if(admin && !online[admin.name]){
    //server has been restarted
    	req.flash('login', 'Login expired');
    	delete req.session.user;
    	res.redirect('/user/login');
  	}
  	else if(admin.admin == false){
    	req.flash('main', "You don't have the proper admin credentials to access this route");
    	res.redirect('/user/main');
  	}
  	else{ //user is an admin
  		res.render('admin', '');
  	}


});


module.exports = router;