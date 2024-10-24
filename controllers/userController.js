async function createUserGet(req, res) {
  res.render('user/signUp');
}

async function logInGet(req, res) {
  res.render('user/logIn');
}

async function logOut(req, res) {
  res.send('logout');
}

async function getUserDetails(req, res) {
  res.render('user/userDetails', {
    username: req.params.username,
  });
}

async function joinMembershipGet(req, res) {
  res.render('user/joinMembership');
}

module.exports = {
  createUserGet,
  logInGet,
  logOut,
  getUserDetails,
  joinMembershipGet,
}