// PostgreSQL Database

var pg = require('pg');

// Connection string to the database
var connstr = 'postgres://whxrsbxv:lY_KNFCH8xQh8BRfqC89HQTDS9RiEir_' + 
              '@pellefant.db.elephantsql.com:5432/whxrsbxv';

// Add a user to the database
exports.add = (user, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'INSERT INTO users VALUES (default, $1, $2, $3, $4, $5)';
    client.query(q, [user.fname, user.lname, user.email, user.pass, user.dob], 
      (err, result) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      var u = result.rows[0];

      console.log(u);
      cb(undefined, u);
    });
  });
};

// Remove a user form the database
exports.remove = (user, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'DELETE FROM users WHERE user = (default, $1, $2, $3, $4, $5)';
    client.query(q, [user.fname, user.lname, user.email, user.pass, user.dob], 
      (err, result) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      var u = result.rows[0];

      console.log(u);
      cb(undefined, u);
    });
  });
};

// Lookup a user in the database
exports.lookup = (user, pass, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    client.query('SELECT * FROM users WHERE user = $1', [user], 
      (err, result) => {
      done(); // Release the client back to the pool

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (result.rows.length == 0) {
        cb('User ' + user + ' does not exist');
        return;
      }

      var u = result.rows[0];
      if (u.password != pass) {
        cb('Password for ' + u.fname + ' is not correct');
        return;
      }

      console.log(u.email);
      cb(undefined, u);
    });
  });
};