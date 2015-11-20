// PostgreSQL Database

var pg = require('pg');

// Connection string to the database
var connstr = 'postgres://whxrsbxv:lY_KNFCH8xQh8BRfqC89HQTDS9RiEir_' + 
                '@pellefant.db.elephantsql.com:5432/whxrsbxv';

// Lookup function to search for users in the database
exports.lookup = (user, pass, cb) => {
  pg.connect(connstr, function(err, client, done) {
    // Check if there was a connection error
    if (err) {
      cb('Unable to connect to the database:' + err);
      return;
    }

    client.query('Select * from users where fname = $1', [user], 
      (err, result) => {
      done(); // Release the client back to the pool

      // Check if there was a connection error
      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      // Check if the user exists
      if (result.rows.length == 0) {
        cb('User ' + user + ' does not exist');
        return;
      }

      // Check if the password is correct
      var u = result.rows[0];
      if (u.password != pass) {
        cb('Password for ' + u.fname + ' is not correct');
        return;
      }

      cb(undefined, u); // Callback with user data
    });
  });
};