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
  });
  res.redirect('sign-up');
}

async function renderUserDetails(req, res) {
  res.render('user/userDetails', {
    username: req.params.username,
  });
}

function renderJoinMembership(req, res) {
  res.render('user/joinMembership');
}

module.exports = {
  renderSignUp,
  validateSignUp,
  handleSignUp,
  renderUserDetails,
  renderJoinMembership,
}