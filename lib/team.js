//This was taken from the homework project 2. 
//This is Ben Cheung's solution to that project
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
  

  member('bcheung', 'Benjamin', 'Cheung', 'I am a software analyst. My strong suit is working with databases and back end, but I will also be working on front end development of this project.'),
  member('apli', 'Anthony', 'Li', 'junior'),
  member('hkeswani', 'Harsh', 'Keswani', 'junior'),
  member('zmilrod', 'Zachary', 'Milrod', 'junior'),
  member('jgatley', 'Jonathan', 'Gatley', 'junior')


];


function copy(memberl) {
 
  var res = member(memberl.user, memberl.fname, memberl.lname, memberl.desc);
  return res;
}


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


function find(user) {

  
  for(i = 0; i < team.length; i++) {
    if(team[i].user === user)
      return copy(team[i]);
  }
  return null;
}


function all() {
  
  var thhe = 'team members';
  var res = result(true, thhe, copyAll(team));
  return res;
}


function one(user) {
 
  var arra = [];
  if(  typeof user !== 'string') 
    return result(false, "Input not a String", arra);

  var found = find(user);

  if (found != null) {
    return result(true, "team member found", [found]);
  }
  else
    return result(false, "team member not found", arra);
}

exports.all = all;
exports.one = one;
