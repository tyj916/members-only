const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/queries');

const alphaErr = 'must only contain letters.';
const nameLengthErr = 'must be between 1 and 20 characters.';

function renderSignUp(req, res) {
  res.render('user/signUp');
}

const validateSignUp = [
  body('firstName').trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`First name ${nameLengthErr}`),
  body('lastName').trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`Last name ${nameLengthErr}`),
  body('username').trim()
    .isLength({ min: 1, max: 255}).withMessage('Username must not exceed 255 characters.')
    .custom(async (value) => {
      const user = await db.getUserByUsername(value);
      if (user) {
        // Asynchronous validator will return a promise
        // Reject the promise to make it invalid
        throw new Error('Username already in use');
      }
    }),
  body('password')
    .isLength({ min: 6 }).withMessage(`Password must be at least 6 characters`),
  body('passwordConfirmation')
    .custom((value, {req}) => {
      return value === req.body.password;
    }).withMessage('Password do not match'),
];

async function handleSignUp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('user/signUp', {
      errors: errors.array(),
    });
  }

  const { firstName, lastName, username, password } = req.body;
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      throw new Error('Password encrypt error');
    }

    await db.createUser(firstName, lastName, username, hashedPassword);
    
    res.redirect(`/u/${username}`);
  });
}

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
  renderSignUp,
  validateSignUp,
  handleSignUp,
  renderUserDetails,
  renderJoinMembership,
  validateMemberPasscode,
  handleJoinMembership,
}