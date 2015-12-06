// Source: 03-stateful-admin-student

// Unique ID assigned to the user
var nextUID = 0;

// Create a new user object
module.exports = exports = user = (major, year, fname, lname, email, pass, 
  dob, spireid) => {
  return {
    uid : ++nextUID,
    major: major,
    year: year,
    fname: fname,
    lname: lname,
    email: email,
    pass: pass,
    dob: dob,
    spireid: spireid,
    flags: 0
  };
}
