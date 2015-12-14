// Database functions for querying the SQL database

var pg = require('pg');
var fs = require('fs');

var password = fs.readFileSync('db').toString().split('\n')[0];
var connstr = 'postgres://whxrsbxv:' + password +
              '@pellefant.db.elephantsql.com:5432/whxrsbxv';

////// Start User Functions

// Add a user to the database
exports.addUser = (user, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    // Only insert into the table if the record doesn't already exist
    var q = 'INSERT INTO users (major, year, fname, lname, email, pass, dob, ' + 
            'spireid, flags) SELECT $1, $2, $3, $4, CAST($5 AS VARCHAR), $6, ' +
            '$7, $8, $9 WHERE NOT EXISTS (SELECT email FROM users WHERE ' + 
            'email = $5)';
    client.query(q, [user.major, user.year, user.fname, user.lname, user.email,
      user.pass, user.dob, user.spireid, user.flags], (err, data) => {
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

    // Delete the user using their email
    var q = 'WITH banned AS (DELETE FROM users WHERE email = $1 RETURNING ' + 
            'email) INSERT INTO blacklist (email) SELECT * FROM banned';
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

    // Select all information of the user using their email
    var q = 'SELECT * FROM users WHERE email = $1';
    client.query(q, [email], (err, data) => {
      done(); // Release the client back to the pool

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};

// Check if the user is in the blacklist
exports.isBanned = (email, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    // Select a user form the blacklist using their email
    var q = 'SELECT * FROM blacklist WHERE email = $1';
    client.query(q, [email], (err, data) => {
        if (err) {
          cb('Unable to connect to the database: ' + err);
          return;
        }

        cb(undefined, data.rows[0]);
      });    
  });
};

// Retrieve the table of all users and their attributes
exports.users = (cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
    }

    // Select all information for all users
    var q = 'SELECT * FROM users';
    client.query(q, (err, data) => {
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

////// End User Functions

////// Start Profile Functions

// Retrieve the profile information from the database based on the SPIRE ID
exports.getProfile = (spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
    }

    // Select all information for a user using their spireid
    var q = 'SELECT * FROM users where spireid = $1';
    client.query(q, [spireid], (err, data) => {
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

// Update the about information for a specific user
exports.updateAbout = (about, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    // Update the about information for a user using their spireid
    var q = 'UPDATE users SET about = $1 where spireid = $2';
    client.query(q, [about, spireid], (err, data) => {
      done(); // Release the client back to the pool


      if (data.rows.length === 0) {
        cb('update failed');
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};

////// End Profile Functions

////// Start Dev Team Functions

// Retrieve the dev team from the database
exports.team = (cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
    }

    // Select all information for all devs
    var q = 'SELECT * FROM team';
    client.query(q, (err, data) => {
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

// Look up a specific dev from the database
exports.lookupMember = (fname, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    // Select all information for a dev using their first name
    var q = 'SELECT * FROM team WHERE fname = $1';
    client.query(q, [fname], (err, data) => {
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

////// End Dev Team Functions

////// Start Class Functions

// Join a class that will show up on the home page for the user
exports.joinClass = (num, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    // Add a student to a class using their spireid if they aren't enrolled
    var q = 'UPDATE classes SET students = ARRAY_APPEND(students, CAST($2 AS ' +
            'VARCHAR)) WHERE num = $1 AND NOT EXISTS (SELECT students FROM ' + 
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

// Remove a user from a class they joined
exports.leaveClass = (classid, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    // Remove a student from a class using their spireid and the classid
    var q = 'UPDATE classes SET students = ARRAY_REMOVE(students, $2)' +
            'WHERE classid = $1'
    client.query(q, [classid, spireid], (err, data) => {
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

    // Select all information from every class using their classid
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

    // Select all information from every class containing a student's spireid
    var q = 'SELECT * FROM classes WHERE $1 = ANY (students) LIMIT 6';
    client.query(q, [spireid], (err, data) => {
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

// Retrives the classes under a specific subject
exports.getClassList = (cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
    }

    // Select all information for every class in ascending order
    var q = 'SELECT * FROM classes ORDER BY classid ASC';
    client.query(q, (err, data) => {
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

    // Select the class number and its students using its classid
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

////// End Class Functions

////// Start Schedule Functions

// Create an event in the database
exports.createEvent = (name, title, description, location, date, classid, 
  spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    // Insert a new event using the form value arguments and set the user
    // who added the event as attending
    var q = 'INSERT INTO events VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, ' +
            '$10, default)';
    client.query(q, [name, title, description, location, date, classid, 
      spireid, '{' + spireid + '}', '{}', 1], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to database: ' + err);
        return;
      }

      cb(undefined);
    });
  });
};

// Create a post in the database
exports.createPost = (name, spireid, classid, title, content, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    // Insert a new post using the form value arguments
    var q = 'INSERT INTO posts VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)';
    client.query(q, [name, spireid, classid, title, content], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to database: ' + err);
        return;
      }
  
      cb(undefined);
    });
  });
};

exports.postComment = (pid, content, fname, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if(err){
      cb('Unable to connect to database: ' + err);
      return;
    }

    var q = 'INSERT INTO comments VALUES ($1, NOW(), $2, $3, $4)';
    client.query(q, [pid, content, spireid, fname], (err, data) => {
      done();
      
      if(err){
         cb('Unable to connect to database: ' + err);
        return;
      }
  
      cb(undefined);
    });
  });
};

exports.getComments = (pid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if(err){
      cb('Unable to connect to database: ' + err);
      return;
    }

    var q = 'SELECT * FROM comments WHERE pid = $1';
    client.query(q, [pid], (err, data) =>{
      done();
      if(err){
        cb('Unable to connect to database: ' + err);
        return;
      }

      cb(undefined, data.rows);
    });
  });
};

//Increments number of flags on post
exports.postFlag = (pid, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    var q = 'UPDATE posts SET flag = ARRAY_APPEND(flag, $2 ' +
            ') WHERE pid = $1 AND NOT EXISTS (SELECT flag FROM ' + 
            'posts WHERE $2 = ANY (flag) AND pid = $1)';
    client.query(q, [pid, spireid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to database: ' + err);
        return;
      }

      cb(undefined);
    });
  });
};

//Increments number of flags on post
exports.commentFlag = (cid, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    var q = 'UPDATE comments SET flag = ARRAY_APPEND(flag, CAST($2 AS ' +
            'VARCHAR)) WHERE cid = $1 AND NOT EXISTS (SELECT flag FROM ' + 
            'comments WHERE $2 = ANY (flag) AND cid = $1)';
    client.query(q, [cid, spireid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to database: ' + err);
        return;
      }

      cb(undefined);
    });
  });
};

exports.getCID = (pid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to database: ' + err);
      return;
    }

    var q = 'SELECT * FROM posts WHERE pid=$1';
    client.query(q, [pid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to database: ' + err);
        return;
      }
  
      cb(undefined, data.classid);
    });
  });
};


// Retrieve all events for a specific class
exports.getEventsByClass = (classid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb("unable to connect to database: " + err);
      return;
    }

    // Retrieve all events within the next 14 days
    var q = 'SELECT * FROM events WHERE classid = $1 AND DATE > ' + 
            'CURRENT_DATE - 1 AND DATE < CURRENT_DATE + 14';
    client.query(q, [classid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }
      cb(undefined, data.rows);
    });

  });
};

// Retrieve all posts for a specific class
exports.getPostsByClass = (classid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if(err){
      cb("unable to connect to database: " + err);
      return;
    }

    // Retrieve all posts within the next 14 days
    var q = 'SELECT * FROM posts WHERE classid = $1 AND DATE > ' + 
            'CURRENT_DATE - 1 AND DATE < CURRENT_DATE + 14';
    client.query(q, [classid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }
      cb(undefined, data.rows);
    });
  });
};

// Retrieve the details of specific events
exports.getEventDetails = (classid, eid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb("Unable to connect to database: " + err);
      return;
    }

    // Select all information for the event using its classid and event id
    var q = 'SELECT * FROM events WHERE classid = $1 AND eid = $2';
    client.query(q, [classid, eid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};

// Retrieve the details of specific events
exports.getPostDetails = (classid, pid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb("Unable to connect to database: " + err);
      return;
    }

    // Select all information for a specific post using its classid and post id
    var q = 'SELECT * FROM posts WHERE classid = $1 AND pid = $2';
    client.query(q, [classid, pid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};

// Attend an event that was posted
exports.attendEvent = (eid, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb("Unable to connect to database: " + err);
      return;
    }

    // Set the user to attending the event posted and increment
    // the number of people that responded, as long as they already haven't
    // responded
    var q = 'UPDATE events SET attending = ARRAY_APPEND(attending, $2), ' + 
            'total = total + 1 WHERE eid = $1 AND NOT EXISTS (SELECT ' + 
            'attending FROM events WHERE $2 = ANY (attending) AND eid = $1) ' + 
            'AND NOT EXISTS (SELECT ignoring FROM events WHERE $2 = ANY ' + 
            '(ignoring) AND eid = $1)';
    client.query(q, [eid, spireid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined);
    });
  });
};

// Ignore an event that was posted
exports.ignoreEvent = (eid, spireid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb("Unable to connect to database: " + err);
      return;
    }

    // Set the user to ignoring the event posted and increment
    // the number of people that responded, as long as they already haven't
    // responded
    var q = 'UPDATE events SET ignoring = ARRAY_APPEND(ignoring, $2), ' + 
            'total = total + 1 WHERE eid = $1 AND NOT EXISTS (SELECT ' + 
            'ignoring FROM events WHERE $2 = ANY (ignoring) AND eid = $1) ' +
            'AND NOT EXISTS (SELECT attending FROM events WHERE $2 = ANY ' + 
            '(attending) AND eid = $1)';
    client.query(q, [eid, spireid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined);
    });
  });
};


// Retrieve statistics of an individual event
exports.eventStats = (eid, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb("Unable to connect to database: " + err);
      return;
    }

    // Get the number of people attending, ignoring, and total number of people
    // who responded to the event
    var q = 'SELECT attending, ignoring, total FROM events WHERE eid = $1';
    client.query(q, [eid], (err, data) => {
      done();

      if (err) {
        cb('Unable to connect to the database: ' + err);
        return;
      }

      cb(undefined, data.rows[0]);
    });
  });
};


////// End Schedule Functions

////// Start Authorization Functions

// Authorize a user based on their email and password
exports.authorizeUser = (email, pass, cb) => {
  pg.connect(connstr, (err, client, done) => {
    if (err) {
      cb('Unable to connect to the database: ' + err);
      return;
    }

    // Select all information for a user using their email
    var q = 'SELECT * FROM users WHERE email = $1';
    client.query(q, [email], (err, data) => {
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

    // Select all devs by their email and if they are an admin
    var q = 'SELECT * FROM team WHERE email = $1 AND admin = true';
    client.query(q, [email], (err, data) => {
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

////// End Authorization Functions
