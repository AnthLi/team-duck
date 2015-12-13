// Checks if the user session exists and they're online

module.exports = exports = sessionCheck = (user, online, req, res) => {
  // User session doesn't exist
  if (!user) {
    req.flash('login', 'Not logged in');
    res.redirect('/user/login');
    return false;
  }

  // User session expired
  if (user && !online[user.uid]) {
    delete req.session.user;
    req.flash('login', 'Login expired');
    res.redirect('/user/login');
    return false;
  }

  return true;
}
  