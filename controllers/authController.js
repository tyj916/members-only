const { body, validationResult } = require('express-validator');
const db = require('../db/queries');
const bcrypt = require('bcryptjs');

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

async function handleSignUp(req, res, next) {
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
    next();
  });
}

function renderLogIn(req, res) {
  if (req.session.messages && req.session.messages.length > 1) {
    res.render('user/logIn', {
      errors: [{msg: 'Log in failed. ' + req.session.messages.pop()}],
    });
  } else {
    res.render('user/logIn');
  }
}

const validateLogIn = [
  body('username').trim()
    .isLength({ min: 1, max: 255}).withMessage('Username must not exceed 255 characters.'),
  body('password')
    .isLength({ min: 6 }).withMessage(`Password must be at least 6 characters`),
];

function handleLogIn(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('user/logIn', {
      errors: errors.array(),
    });
  }
  next();
}

function handleLogOut(req, res) {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}

module.exports = {
  renderSignUp,
  validateSignUp,
  handleSignUp,
  renderLogIn,
  validateLogIn,
  handleLogIn,
  handleLogOut,
}