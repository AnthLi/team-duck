// Source: 03-stateful-admin-student

// Unique ID assigned to the user
var nextUID = 0;

// Create a new user object
module.exports = exports = user = (fname, lname, email, pass, dob) => {
  return {
    uid : ++nextUID,
    fname: fname,
    lname: lname,
    email: email,
    pass: pass,
    dob: dob,
    admin: false,
    flags : 0
  };
}