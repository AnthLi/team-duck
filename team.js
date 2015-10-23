
function member(user, fname, lname, year) {
	return {
		user: user,
		fname: fname,
		lname: lname,
		year: year
	};
}


var team = [
	// Keep this first member for testing please.
	member('jdoe', 'John', 'Doe', 'senior'),
	member('bcheung', 'Benjamin', 'Cheung', 'junior'),
	member('apli', 'Anthony', 'Li', 'junior'),
	member('hkeswani', 'Harsh', 'Keswani', 'junior'),
	member('zmilrod', 'Zachary', 'Milrod', 'junior'),
	member('jgatley', 'Jonathan', 'Gatley', 'junior')
	// TODO: add your team members here:
];


function copy(memberl) {
	// TODO
	var res = member(memberl.user, memberl.fname, memberl.lname, memberl.year);
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
	// TODO
	
	// team.forEach(m => {
	// 	if (m.user === user)
	// 		return m;
	// });
	// return null;
	for(i = 0; i < team.length; i++) {
		if(team[i].user === user)
			return copy(team[i]);
	}
	return null;
}


function all() {
	// TODO
	var thhe = 'team members';
	var res = result(true, thhe, copyAll(team));
	return res;
}


function one(user) {
	// TODO
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

// This exports public functions to the outside world.
exports.all = all;
exports.one = one;