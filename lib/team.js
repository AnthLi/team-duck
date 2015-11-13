// Source: 02-basic-app-student
function member(user, fname, lname, desc, pos) {
  return {
    user: user,
    fname: fname,
    lname: lname,
    desc: desc,
    pos: pos
  };
}

var team = [
  member('bcheung', 'Benjamin', 'Cheung', 'Hey, I am a software engineer. My strong suit is working with databases and back end, but I will also be working on front end development of this project. My primary focus on this application will be on the database and backend side. I live and grew up in the pioneer valley. Currently, I am on track for a B.S in Computer Science at the University of Massachussetts. I really enjoy coding and believe this experience with the team will be especially enriching for me.', 'Backend Developer'),
  member('apli', 'Anthony', 'Li', 'My expertise involves software implementation and optimization. I have a passion for developing software and constantly improving it to be as efficient as possible. The most recent experience of mine is rewriting middleware written in Golang to Scala and implementing new features focused around content acquisition. The majority of this work was done through independent research to find the best available software components to integrate into the platform. On top this, I also conducted performance testing and optimization of my software. My primary role will be to focus on middleware and backend development, and some development on the frontend.', 'Backend Developer'),
  member('hkeswani', 'Harsh', 'Keswani', 'Hello there, I am a student at UMass Amherst. I study Computer Science. I lived in Mumbai till I was 18 and then moved to the US to get my Bachelors degree. Most of my recent work has been full stack development. I am passionate about design and creating disruptive ideas. I will be working on front-end development and database management for this project.', 'Design, Routing and Database'),
  member('zmilrod', 'Zachary', 'Milrod', 'My work so far has been mainly front-end work making static websites. Doing those projects, I got a feel for how a website should look while still being easily usable to the user. However, I am interested in backend work and hope to learn and use those new skills in this application. I will be working on the Design and Network.', 'Design and Network'),
  member('jgatley', 'Jonathan', 'Gatley', 'I am a software developer and a student at UMass Amherst. Much of my work in the past has involved extracting and analyzing HTML, as well as creating structures to hold data. Although my strengths are in data structures and management, my job focuses on the front end. My main goal is to ensure that the threads and forums of the application are working as intended. The final design should be user-friendly and functional.', 'Front End Developer')
];


function copy(member) {
  return Object.assign({}, member);
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
  return result(true, 'team members', copyAll(team));
}


function one(user) {
  if (typeof user !== 'string') {
    return result(false, 'input user is not a string', []);
  } else if (find(user) === null){
    return result(false, 'team member not found', []);
  }

  return result(true, 'team member found', [find(user)]);
}

exports.all = all;
exports.one = one;
