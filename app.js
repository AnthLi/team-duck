var express = require('express');
var handlebars = require('express-handlebars');

var app = express();

app.set('port', process.env.PORT || 3000);

var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/about', (req, res) => {
  res.render('about', {
    pageTestScript: '/views/about.handlebars'
  });
});

app.get('/team', (req, res) => {
  res.render('team', {
    pageTestScript: '/views/team.handlebars'
  });
});