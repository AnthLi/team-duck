// The necessary imports required for the web app
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var flash = require('connect-flash');
var handlebars = require('express-handlebars');
var session = require('express-session');

var online = require('./lib/online').online; // List of online users
var team = require('./lib/team.js'); // Team library

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

// Home page
app.get('/index', (req, res) => {
  var user = req.session.user;
  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
  } else if (user && !online[user.email]) {
    req.flash('login', 'Login Expired');
    delete req.session.user;
    res.redirect('/user/login')
  } else {    
    res.render('index', {
      title: 'Home Page',
      message: req.flash('index') || '',
      name: user.email,
      indicator: true
    });
  }
});

// Team page
app.get('/team', (req, res) => {
  var members = ['apli', 'bcheung', 'hkeswani', 'jgatley', 'zmilrod'];
  var user = req.query.user;
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
});

////// End User-Defined Routes

// Start the express app on port 3000
app.listen(app.get('port'), () => {
  console.log('Express application started on http://localhost:' +
              app.get('port') + '; press Ctrl-C to terminate');
});
