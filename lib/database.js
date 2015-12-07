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

      cb(undefined);
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

// Add a class to the database
exports.addClass = (classNumber, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    var q = 'INSERT INTO classes VALUES ($1, \'\')';
    client.query(q, [classNumber], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, data.rows);
    });
  });
};


exports.classLookup = (classNum, cb) => {
  pg.connect(connstr, (err, client, done) => {
      if(err){
        cb('Unable to connect to the database: ' + err);
        return;
      }

      var q = 'SELECT * FROM classes WHERE class_id = $1';
      client.query(q, [classNum], (err, data) => {
        done();

        if(err){
          cb('Unable to connect to the database: ' + err);
          return;
        }

        if(data.rows.length === 0){
          cb('No users in the database');
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


//Gets the classes of a specific user
exports.getPersonalClasses = (spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if(err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT * FROM students WHERE spireid = $1', [spireid], (err, data) => {
      done();

      if(err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('No Classes', data);
        return;
      }

      cb(undefined, data.rows);
    });
  });
};

//Displays all classes
exports.getUserClasses = (cb) => {
  pg.connect(connstr, (err, client, done) => {
    if(err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT * FROM "public"."classes"', (err, data) => {
      done();

      if(err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('No Classes');
        return;
      }

      cb(undefined, data.rows);
    });
  });
};

// Retrieve the profile information from the database based on the SPIRE ID
exports.getProfile = (spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if(err) {
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

exports.getStudents = (cb) => {
  pg.connect(connstr, (err, client, done) => {
     if(err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('select spireid from users where spireid IS NOT null',
      (err, students) => {
      done();

      if(err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (students.rows.length == 0) {
        cb('No users');
        return;
      }

      cb(undefined, students.rows);
    });
  });
};

exports.getInstructor = (cb) => {
  pg.connect(connstr, (err, client, done) => {
    if(err) {
      cb('Unable to connect to the database: ' + err);
    }

    client.query('SELECT instructor FROM classes', (err, data) => {
      done();

      if(err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length == 0) {
        cb('No team members');
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

//dealing with classes
exports.GetClassDetails = (class_id, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    client.query('SELECT * FROM classes where class_id = $1',
      [class_id], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      if (data.rows.length === 0) {
        cb('class id issue');
        return;
      }

      cb(undefined, data.rows[0]);
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
exports.updateAttending = (class_id, cb) => {
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

exports.addStudentClass = (id, name, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
      dd='0'+dd
    }
    if(mm<10) {
      mm='0'+mm
    }
    today = mm+'/'+dd+'/'+yyyy;

    var q = 'INSERT INTO students VALUES (default, $1, $2, $3, $4)';
    client.query(q , [spireid, id, name, today], (err, data) => {
      done();

    if (err) {
      console.log(spireid + '  ' + id + '  ' + name + '   ' + today );
      cb('Unable to connect to database: ' + err);
      return;
    }
    cb(undefined);
  });
});
};
