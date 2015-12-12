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

    // Only insert into the table if the record doesn't already exist
    var q = 'INSERT INTO users (major, year, fname, lname, email, pass, dob, ' + 
            'spireid) SELECT $1, $2, $3, $4, CAST($5 AS VARCHAR), $6, $7, $8 ' + 
            'WHERE NOT EXISTS (SELECT email FROM users WHERE email = $5)';
    client.query(q, [user.major, user.year, user.fname, user.lname, user.email,
      user.pass, user.dob, user.spireid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, data);
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

      cb(undefined, data.rows[0]);
    });
  });
};

exports.updateAbout = (about, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    client.query('UPDATE users SET about = $1 where spireid = $2',
      [about, spireid], (err, data) => {
      done(); // Release the client back to the pool


      if (data.rows.length === 0) {
        cb('update failed');
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};

// Retrieve the profile information from the database based on the SPIRE ID
exports.getProfile = (spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT * FROM users where spireid = $1', [spireid],
      (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.uid === 0) {
        cb('User ' + email + ' does not exist');
        return;
      }

      cb(undefined, data.rows);
    });
  });
};

// Retrieve the table of all users and their attributes
exports.users = (cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT * FROM users', (err, data) => {
      done();

      if (err) {
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
    if (err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT * FROM team', (err, data) => {
      done();

      if (err) {
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

exports.lookupMember = (fname, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    client.query('SELECT * FROM team WHERE fname = $1', [fname],
      (err, data) => {
      done(); // Release the client back to the pool

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('Member ' + fname + ' does not exist');
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};

// Add a class to the database
exports.addClass = (num, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'INSERT INTO classes VALUES (default, $1, \'\')';
    client.query(q, [num], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, data.rows);
    });
  });
};

// Add a class to a student's selection of classes
exports.addStudentClass = (num, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    // Add the spireid to the students array if it does not already exist
    var q = 'UPDATE classes SET students = ARRAY_APPEND(students, $2 ' + 
            'WHERE num = $1 AND NOT EXISTS (SELECT students FROM ' + 
            'classes WHERE $2 = ANY (students) AND num = $1)';
    client.query(q , [num, spireid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to database: ' + err);
        return;
      }

      cb(undefined);
    });
  });
};

// Looks up a class based on the classid
exports.classLookup = (classid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'SELECT * FROM classes WHERE classid = $1';
    client.query(q, [classid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('No class in the database');
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};

// Gets the classes of a specific user
exports.getPersonalClasses = (spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT * FROM classes WHERE $1 = ANY (students)', [spireid], 
      (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('No classes found', data);
        return;
      }

      cb(undefined, data.rows);
    });
  });
};

// Displays all classes
exports.getClassList = (cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT * FROM classes ORDER BY num ASC', (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, data.rows);
    });
  });
};

// Get the class number and each user by the classid
exports.getClassDetails = (classid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'SELECT classes.num, classes.students FROM classes WHERE ' + 
            'classid = $1';
    client.query(q, [classid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('Class ID is invalid');
        return;
      }

      cb(undefined, data.rows);
    });
  });
};

// Create an event in the database
exports.createEvent = (name, title, description, location, date, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    var q = 'INSERT INTO events VALUES ($1, $2, $3, $4, $5)';
    client.query(q, [name, title, description, location, date], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to database: ' + err);
        return;
      }

      cb(undefined);
    });
  });
};

// Update the number of people attending a group
exports.updateAttending = (classid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    client.query('UPDATE schedule SET attending = attending + 1',
      (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to database: ' + err);
        return;
      }

      cb(undefined);
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
