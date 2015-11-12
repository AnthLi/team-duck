// PostgreSQL Database

var pg = require('pg');

// Connection string to the database
var conString = 'postgres://whxrsbxv:lY_KNFCH8xQh8BRfqC89HQTDS9RiEir_' + 
                '@pellefant.db.elephantsql.com:5432/whxrsbxv';

exports.lookup = (user, pass, cb) => {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      cb('Unable to connect to the database:' + err);
    }

    client.query('Select * from users where fname = $1', [user], (err, result) => {
      done(); // Release the client back to the pool

      if (err) {
        cb('Unable to connect to the database: ' + err);
      }

      if (result.rows.length == 0) {
        cb('User ' + user + ' does not exist');
      }

      var u = result.rows[0];
      if (u.password != pass) {
        cb('Password for ' + u.fname + ' is not correct');
      }

      cb(undefined, u);
    });
  });
};