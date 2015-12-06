// Source: 03-stateful-admin-student

// Unique ID assigned to the user
var nextUID = 0;

// Create a new user object
module.exports = exports = user = (major, year, fname, lname, email, pass, 
  dob, spireid, about) => {
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
    about: about,
    flags: 0
  };
}
