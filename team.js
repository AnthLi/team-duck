// Source: 02-basic-app-student

// Creates a new team member
function member(user, fname, lname, desc) {
  return {
    user: user,
    fname: fname,
    lname: lname,
    desc: desc
  };
}

//Todo: Change 'junior' to your description 
var team = [ 
  member('bcheung', 'Benjamin', 'Cheung', 'junior'),
  member('apli', 'Anthony', 'Li', 'junior'),
  member('hkeswani', 'Harsh', 'Keswani', 'junior'),
  member('zmilrod', 'Zachary', 'Milrod', 'junior'),
  member('jgatley', 'Jonathan', 'Gatley', 'junior')
];

// Makes a copy of a member object
function copy(memberl) {
  return Object.assign({}, member);
}

// Returns a copy of all team members in a new array
function copyAll(members) {
  var nmembers = [];
  members.forEach(m => {
    nmembers.push(copy(m));
  });
  return nmembers;
}


function result(success, message, data) {
  return {
    success: success,
    message: message,
    data: data,
    count: data.length
  };
}

// Lookup a member by their username
function find(user) {
  for(i = 0; i < team.length; i++) {
    if(team[i].user === user)
      return copy(team[i]);
  }
  return null;
}

// Returns a result object containing all of the team members
function all() {
  return result(true, 'team members', copyAll(team));;
}

// Returns a result object containing the team member that was found
function one(user) {
  if (typeof user !== 'string') {
    return result(false, 'input user is not a string', []);
  } else if (find(user) === null){
    return result(false, 'team member not found', []);
  }

  return result(true, 'team member found', [find(user)]);
}

// This exports public functions to the outside world.
exports.all = all;
exports.one = one;