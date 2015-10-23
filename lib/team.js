//This was taken from the homework project 2.
//This is Ben Cheung's solution to that project
// Source: 02-basic-app-student
function member(user, fname, lname, desc, pos) {
  return {
    user: user,
    fname: fname,
    lname: lname,
    desc: desc,
    pos : pos
  };
}

//Todo: Change 'junior' to your description
var team = [



  member('bcheung', 'Benjamin', 'Cheung', 'I am a software analyst. My strong suit is working with databases and back end, but I will also be working on front end development of this project.', 'Backend Developer'),
  member('apli', 'Anthony', 'Li', 'junior', 'Backend Developer'),
  member('hkeswani', 'Harsh', 'Keswani', 'Most of my recent work has been full stack development. I am passionate about design and creating disruptive ideas. I will be working on front-end development and database management.', 'Design, Routing and Database'),
  member('zmilrod', 'Zachary', 'Milrod', 'junior', 'Design and Network'),
  member('jgatley', 'Jonathan', 'Gatley', 'I am a software developer. My strengths and focus will be working on the front end. My main goal is to ensure that the threads and forums of the application are working as intended. The final design should be user-friendly and functional.', 'Admin, Contextulizer and Marketeer')



];


function copy(memberl) {
  var res = member(memberl.user, memberl.fname, memberl.lname, memberl.desc, memberl.pos);

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
