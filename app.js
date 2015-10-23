// The necessary libraries required for the web app
var express = require('express');
var handlebars = require('express-handlebars');

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
  res.render('layouts/404');
}

// Defined routes
app.get('/about', (req, res) => {
  res.render('layouts/about');
});

app.get('/mockups', (req, res) => {
  res.render('layouts/mockups');
});
var team = require('./team.js');
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
  	//only need one handlebar page since it's all dynamic. 
  	//so currently linked to apli.handlebars since thats the 
  	//one i changed
    res.render('teammates/' + 'apli', {memberx: single[0]});
  } else if (member && members.indexOf(member) < 0) {
    notFound404(req, res);
  } else {
    res.render('layouts/team', {members: Mem});
  }
});


app.get('/:mock', (req, res) => {
  switch(req.params.mock){
    case 'home':
        res.render('mockups', {imgURL: '/imgs/HomePage.png'});
        break;
    case 'login':
        res.render('mockups', {imgURL: '/imgs/Login.png'});
        break;
    case 'profile':
        res.render('mockups', {imgURL: '/imgs/ProfileView.png'});
        break;
    case 'admin':
        res.render('mockups', {imgURL: '/imgs/AdminView.png'});
        break;    
    default :
        break;      
  }
});
// Start the express app on port 3000
app.listen(app.get('port'), () => {
  console.log('Express application started on http://localhost:' +
              app.get('port') + '; press Ctrl-C to terminate');
});
