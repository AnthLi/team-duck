// The necessary imports required for the web app
var express = require('express');
var handlebars = require('express-handlebars');
var team = require('./lib/team.js');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

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
// Session Support:
app.use(session({
  secret: 'octocat',
  // Both of the options below are deprecated, but should be false
  // until removed from the library - sometimes, the reality of
  // libraries can be rather annoying!
  saveUninitialized: false, // does not save uninitialized session.
  resave: false             // does not save session if not modified.
}));
app.use(cookieParser());
app.use(flash());
app.use('/user', require('./routes/user-routes'));
app.use('/admin', require('./routes/admin-routes'));

////// Error middleware //////

// Middleware function for when the requested path does not exist
// Source: 02-basic-app-student
function notFound404(req, res) {
  res.status(404);
  res.render('layouts/404');
}

//////////////////////////////

app.get('/', (req, res) => {
  res.redirect('/user/login');
});

// Mockup pages for each mockup image
app.get('/:mock', (req, res) => {
  switch(req.params.mock){
    case 'home':
      res.render('mockup', {imgURL: '/imgs/Home.png'});
      break;
    case 'login':
      res.render('login', {imgURL: '/imgs/Login.png'});
      break;
    case 'profile':
      res.render('mockup', {imgURL: '/imgs/Profile.png'});
      break;
    case 'admin':
      res.render('mockup', {imgURL: '/imgs/Admin.png'});
      break; 
    case 'mockups':
      res.render('mockups');
    default:
      break;
  }
});

// Start the express app on port 3000
app.listen(app.get('port'), () => {
  console.log('Express application started on http://localhost:' +
              app.get('port') + '; press Ctrl-C to terminate');
});