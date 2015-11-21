var nextUID = 0;
var toSub = 0;

function user(name, pass, admin) {
  return {
    name: name,
    pass: pass,
    uid : ++nextUID,
    admin : admin
  };
}

var db = {
  'tim'  : user('tim', 'mit', true),
  'hazel': user('hazel', 'lezah', false),
  'caleb': user('caleb', 'belac', false)
};

exports.lookup = (usr, pass, cb) => {
  if (usr in db) {
    var u = db[usr];
    if (pass == u.pass) {
      cb(undefined, { name: u.name, admin: u.admin });
    }
    else {
      cb('password is invalid');
    }
  }
  else {
    cb('user "' + usr + '" does not exist')
  }
};

exports.list = (cb) => {
  var arr = [];
  var i = 0;
  for(useree in db){
    arr.push( user(
      db[useree].name,
      db[useree].pass,
      db[useree].admin
      ));
    arr[i++].uid = db[useree].uid;
  }

  cb(undefined, arr);
};

exports.add = (u, cb) => {
  var newUser;
  var error = undefined;
  for(usere in db){         //check database to see if name is already taken
    toSub++;
    if(db[usere].name == u[Object.keys(u)[0]]){
      error = "username already taken";
    }
  }
  console.log("before sub: "+toSub);
  if(error == undefined){
    var uName = u[Object.keys(u)[0]]; 
    var uPass = u[Object.keys(u)[1]]; 
    var uAdmin = u[Object.keys(u)[2]];

    newUser = user(uName, uPass, uAdmin); //new user object
    newUser.uid = newUser.uid - toSub;
    u.uid = newUser.uid;      // add new uid to the u object that was passed in
    db[uName] = newUser;      // add new user to the database
  }

  cb(error, u);
};