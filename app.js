// The necessary imports required for the web app
var bodyParser = require('body-parser');
var express = require('express');
var flash = require('connect-flash');
var handlebars = require('express-handlebars');
var session = require('express-session');

var db = require('./lib/database.js'); // Database library
var online = require('./lib/online').online; // List of online users

var app = express();

// Set the port to 3000
app.set('port', process.env.PORT || 3000);

var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(flash());
// Session state support
app.use(session({
  secret: 'octocat',
  // Both of the options below are deprecated, but should be false
  // until removed from the library - sometimes, the reality of
  // libraries can be rather annoying!
  saveUninitialized: false, // does not save uninitialized session.
  resave: false             // does not save session if not modified.
}));
// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/user', require('./routes/user-routes')); // Separate user routes
app.use('/admin', require('./routes/admin-routes')); // Separate admin routes
app.use('/class', require('./routes/class-routes')); // Separate class routes
app.use('/group', require('./routes/group-routes')); // Separate group routes

////// Start User-Defined Routes

// Root directory that redirects to the home page
app.get('/', (req, res) => {
  res.redirect('index');
});

// Home page
app.get('/index', (req, res) => {
  var user = req.session.user;

  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
    return;
  }

  if (user && !online[user.uid]) {
    req.flash('login', 'Login Expired');
    delete req.session.user;
    res.redirect('/user/login');
    return;
  }

  // Get the user's own classes
  db.getPersonalClasses(user.spireid, (err, classesData) => {
    // No error checking here since we still want to render index if the user
    // isn't in any classes

    // Get the list of classes for the dropdown menu
    db.getClassList((err, subjectsData) => {
      if (err) {
        return;
      }

      // If the user is logged in, render fname, lname, and profile pic
      // in the drawer, along with the page data
      // Else, just the page data
      if (user) {
        res.render('index', {
          fname: user.fname,
          lname: user.lname,
          userID: user.spireid,
          classes: classesData,
          classList: subjectsData
        });
      } else {
        res.render('index', {
          classes: classesData,
          classList: subjectsData
        });
      }
    });
  });
});

// About page
app.get('/about', (req, res) => {
  var user = req.session.user;

  if (user) {
    res.render('about', {
      fname: user.fname,
      lname: user.lname,
      userID: user.spireid
    });
  }
  else{
    res.render('about');
  }
});

// Team page
app.get('/team', (req, res) => {
  var user = req.session.user;

  db.team((err, data) => {
    if (err) {
      return;
    }

    // If the user is logged in, render fname, lname, and profile pic
    // in the drawer, along with the page data
    // Else, just the page data
    if (user) {
      res.render('team', {
        fname: user.fname,
        lname: user.lname,
        userID: user.spireid,
        title: 'Meet the team',
        members: data
      });
    } else {
      res.render('team', {
        title: 'Meet the team',
        members: data
      });
    }
  });
});

app.get('/team/:fname', (req, res) => {
  var user = req.session.user;
  var fname = req.params.fname;

  db.lookupMember(fname, (err, data) => {
    if (err) {
      res.redirect('/team')
      return;
    }

    // If the user is logged in, render fname, lname, and profile pic
    // in the drawer, along with the page data
    // Else, just the page data
    if (user) {
      res.render('member', {
        fname: user.fname,
        lname: user.lname,
        userID: user.spireid,
        title: 'Meet the team',
        member: data
      });
    } else {
      res.render('member', {
        title: data.fname,
        member: data
      });
    }
  });
});

////// End User-Defined Routes

////// Start Error Middleware

// Middleware function for when the requested route does not exist

app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});

////// End Error Middleware

// Start the express app on port 3000
app.listen(app.get('port'), () => {
  console.log('Express application started on http://localhost:' +
              app.get('port') + '; press Ctrl-C to terminate');
});
