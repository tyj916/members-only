const { body, validationResult} = require('express-validator');
const db = require('../db/queries');

async function renderUserDetails(req, res) {
  const user = await db.getUserByUsername(req.params.username);

  if (!user) {
    return res.status(404).render('util/errorPage', {
      status: 404,
      message: 'User not found',
    });
  }

  const posts = await db.getPostsByUserId(user.id);
  res.render('user/userDetails', {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    membership_status: user.membership_status,
    user: req.user,
    posts: posts,
  });
}

function renderJoinMembership(req, res) {
  res.render('user/joinMembership', {
    user: req.user,
  });
}

const validateMemberPasscode = [
  body('passcode').trim()
    .isAlphanumeric().withMessage('Passcode must be letters and numbers only.')
    .custom((value) => {
      // Passcodes should be saved at database. Put here for simplicity.
      const passcodes = ['memberPasscode', 'adminPasscode'];
      return passcodes.includes(value);
    }).withMessage('Invalid passcode. Please try again.'),
];

async function handleJoinMembership(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('user/joinMembership', {
      user: req.user,
      errors: errors.array(),
    });
  }

  const memberType = req.body.passcode === 'adminPasscode' ? 'Administrator' : 'Club Member';
  await db.setMembership(req.user.username, memberType);

  if (req.body.passcode === 'adminPasscode') {
    await db.setAdmin(req.user.username);
  }

  res.redirect('/join-member');
}

module.exports = {
  renderUserDetails,
  renderJoinMembership,
  validateMemberPasscode,
  handleJoinMembership,
}