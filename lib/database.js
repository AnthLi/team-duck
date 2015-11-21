// Library to add, remove, and lookup users in the database

var pg = require('pg');

var connstr = 'postgres://whxrsbxv:lY_KNFCH8xQh8BRfqC89HQTDS9RiEir_' + 
              '@pellefant.db.elephantsql.com:5432/whxrsbxv';

// Add a user to the database
exports.add = (user, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'INSERT INTO users VALUES (default, $1, $2, $3, $4, $5, $6)';
    client.query(q, [user.fname, user.lname, user.email, user.pass, user.dob, 
      user.admin], (err, result) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, result.rows[0]);
    });
  });
};

// Remove a user from the database based on their email
exports.remove = (email, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'DELETE FROM users WHERE email = $1';
    client.query(q, [email], (err, result) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, result.rows[0]);
    });
  });
};

// Lookup a user in the database based on their email
exports.lookup = (email, pass, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    client.query('SELECT * FROM users WHERE email = $1', [email], 
      (err, result) => {
      done(); // Release the client back to the pool

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (result.rows.length == 0) {
        cb('User ' + email + ' does not exist');
        return;
      }

      var u = result.rows[0];
      if (u.pass != pass) {
        cb('Password for ' + u.email + ' is not correct');
        return;
      }

      cb(undefined, u);
    });
  });
};
