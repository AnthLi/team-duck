// Library to add, remove, and lookup users in the database

var pg = require('pg');
var fs = require('fs')

var password = fs.readFileSync('db').toString().split('\n')[0];
var connstr = 'postgres://whxrsbxv:' + password + 
              '@pellefant.db.elephantsql.com:5432/whxrsbxv';

// Add a user to the database
exports.addUser = (user, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'INSERT INTO users VALUES (default, $1, $2, $3, $4, $5, $6, $7, ' + 
      '$8)';
    client.query(q, [user.major, user.year, user.fname, user.lname, user.email, 
      user.pass, user.dob, user.spireid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};

// Delete a user from the database based on their email
exports.deleteUser = (email, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'DELETE FROM users WHERE email = $1';
    client.query(q, [email], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined);
    });
  });
};

// Lookup a user in the database based on their email
exports.lookupUser = (email, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    client.query('SELECT * FROM users WHERE email = $1', [email], 
      (err, data) => {
      done(); // Release the client back to the pool

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('User ' + email + ' does not exist');
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};

// Retrieve the table of all users and their attributes
exports.users = (cb) => {
  pg.connect(connstr, (err, client, done) => {
    if(err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT * FROM users', (err, data) => {
      done();

      if(err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('No users in the database');
        return;
      }
      
      cb(undefined, data.rows);
    });
  });
};

// Retrieve the dev team from the database
exports.team = (cb) => {
  pg.connect(connstr, (err, client, done) => {
    if(err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT * FROM team', (err, data) => {
      done();

      if(err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('No team members in the database');
        return;
      }
      
      cb(undefined, data.rows);
    });
  });
};

// Retrieve the profile information from the database based on the UID
exports.getProfile = (uid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var postData = 'posts.pid, posts.pcontent, posts.pdate';
    var commentData = 'comments.cid, comments.ccontent, comments.cdate ';
    var q = 'SELECT users.uid, ' + postData + ', ' + commentData +
            'FROM users ' +
            'JOIN posts ON users.uid = posts.uid ' +
            'JOIN comments ON posts.pid = comments.pid ' +
            'WHERE users.uid = $1 ' +
            'ORDER BY pdate ASC';
    client.query(q, [uid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('User ' + email + ' does not exist');
        return;
      }

      cb(undefined, data.rows);
    });
  });
};

// Authorize a user based on their email and password
exports.authorizeUser = (email, pass, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    client.query('SELECT * FROM users WHERE email = $1', [email], 
      (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('User ' + email + ' does not exist');
        return;
      }

      var u = data.rows[0];

      if (u.pass != pass) {
        cb('Password for ' + u.email + ' is not correct');
        return;
      }
      
      cb(undefined, u);
    });
  });
};

// Authorize a user if they are an admin
exports.authorizeAdmin = (email, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    client.query('SELECT * FROM team WHERE email = $1 AND admin = true', 
      [email], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('User ' + email + ' is not an admin');
        return;
      }
      
      cb(undefined, data.rows[0]);
    });
  });
};
