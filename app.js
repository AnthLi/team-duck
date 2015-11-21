// The necessary imports required for the web app
var express = require('express');
var handlebars = require('express-handlebars');
var team = require('./lib/team.js');

var app = express();

// Set the port to 3000
app.set('port', process.env.PORT || 3000);

var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));


// Error middleware

// Middleware function for when the requested path does not exist
// Source: 02-basic-app-student
function notFound404(req, res) {
  res.status(404);
  res.render('404');
}

// Defined routes

// Splash page
/*app.get('/', (req, res) => {
  //res.render('layouts/mockup', {imgURL: '/imgs/Splash.png'});
  if(!req.session.user || !online[user])
    res.redirect('/user/login');
  else
    res.redirect('/main');
});*/

app.get('/user/login', (req, res) =>{
  //render or redirect the login page in layouts/login 
    res.render('login');
});

// About page
app.get('/about', (req, res) => {
  res.render('about');
});

// Team page
app.get('/team', (req, res) => {
  // Array of each team member
  var members = ['apli', 'bcheung', 'hkeswani', 'jgatley', 'zmilrod'];
  var member = req.query.user; // Get the user from the query string
  var Mem = team.all().data;
  var single = team.one(member).data;

  /* 
  If there is a user in the query and they are a valid user, 
  render the handlebars for that user.
  If the user is not a team member -> 404 error.
  Otherwise, refer to the main team page.
  */
  if (member && members.indexOf(member) >= 0) {
    res.render('members', {
      memberx: single[0]
    });
  } else if (member && members.indexOf(member) < 0) {
    notFound404(req, res);
  } else {
    res.render('team', {
      members: Mem
    });
  }
});

// Mockup pages for each mockup image
app.get('/:mock', (req, res) => {
  switch(req.params.mock) {
    case 'home':
      res.render('mockup', {imgURL: '/imgs/Home.png'});
      break;
    case 'login':
      res.render('mockup', {imgURL: '/imgs/Login.png'});
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