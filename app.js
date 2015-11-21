// The necessary imports required for the web app
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var flash = require('connect-flash');
var handlebars = require('express-handlebars');
var session = require('express-session');

var team = require('./lib/team.js');

var app = express();

// Set the port to 3000
app.set('port', process.env.PORT || 3000);

var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

// Body Parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(flash());

// Session Support:
app.use(session({
  secret: 'octocat',
  // Both of the options below are deprecated, but should be false
  // until removed from the library - sometimes, the reality of
  // libraries can be rather annoying!
  saveUninitialized: false, // does not save uninitialized session.
  resave: false             // does not save session if not modified.
}));

app.use('/user', require('./routes/user-routes'));
app.use('/admin', require('./routes/admin-routes'));

////// Start Error Middleware

// Middleware function for when the requested path does not exist
// Source: 02-basic-app-student
function notFound404(req, res) {
  res.status(404);
  res.render('layouts/404');
}

////// End Error Middleware

////// Start User-Defined Routes

app.get('/', (req, res) => {
  res.redirect('/user/login');
});

app.get('/:view', (req, res) => {
  switch (req.params.view) {
    // Home page
    case 'home': {
      var user = req.session.user;
      if (!user) {
        req.flash('login', 'Not logged in');
        res.redirect('/user/login');
      } else if (user && !online[user.name]) {
        req.flash('login', 'Login Expired');
        delete req.session.user;
        res.redirect('/user/login')
      } else {    
        // capture the user object or create a default.
        var message = req.flash('main') || 'Login Successful';
        res.render('layouts/main', {
          title: 'User Main',
          message: message,
          name: user.name
        });
      }

      break;
    }
    // Team page
    case 'team': {
      // Array of each team member
      var members = ['apli', 'bcheung', 'hkeswani', 'jgatley', 'zmilrod'];
      var user = req.query.user; // Get the user from the query string
      var memberData = team.one(user).data;
      var teamData = team.all().data;

      if (user && members.indexOf(user) >= 0) {
        res.render('members', {
          member: memberData[0]
        });
      } else if (user && members.indexOf(user) < 0) {
        notFound404(req, res);
      } else {
        res.render('team', {
          members: teamData
        });
      }

      break;
    }
  }
});

// Mockup pages for each mockup image
// app.get('/:mock', (req, res) => {
//   switch(req.params.mock){
//     case 'home':
//       res.render('mockup', {imgURL: '/imgs/Home.png'});
//       break;
//     case 'login':
//       res.render('login', {imgURL: '/imgs/Login.png'});
//       break;
//     case 'profile':
//       res.render('mockup', {imgURL: '/imgs/Profile.png'});
//       break;
//     case 'admin':
//       res.render('mockup', {imgURL: '/imgs/Admin.png'});
//       break; 
//     case 'mockups':
//       res.render('mockups');
//     default:
//       break;
//   }
// });

////// End User-Defined Routes

// Start the express app on port 3000
app.listen(app.get('port'), () => {
  console.log('Express application started on http://localhost:' +
              app.get('port') + '; press Ctrl-C to terminate');
});
