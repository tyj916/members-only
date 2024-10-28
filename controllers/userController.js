const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/queries');

const alphaErr = 'must only contain letters.';
const nameLengthErr = 'must be between 1 and 20 characters.';

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

    }).withMessage('Username already in use'),
  body('password')
    .isLength({ min: 6 }).withMessage(`Password must be at least 6 characters`),
  body('passwordConfirmation')
    .custom((value, {req}) => {
      return value === req.body.password
    }).withMessage('Password do not match'),
];

const validateLogIn = [
  body('username').trim()
    .isLength({ min: 1, max: 255}).withMessage('Username must not exceed 255 characters.'),
  body('password')
    .isLength({ min: 6 }).withMessage(`Password must be at least 6 characters`),
];

async function createUserGet(req, res) {
  res.render('user/signUp');
}

const createUserPost = [
  validateSignUp,
  async (req, res) => {
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
]

async function logInGet(req, res) {
  res.render('user/logIn');
}

const logInPost = [
  validateLogIn,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('user/logIn', {
        errors: errors.array(),
      });
    }

    const { username, password } = req.body;
    const user = await db.getUserByUsername(username);
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log('Login failed. Password incorrect');
    } else {
      console.log('Login successful.');
    }

    res.redirect('log-in');
  },
];

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
  createUserPost,
  logInGet,
  logInPost,
  logOut,
  getUserDetails,
  joinMembershipGet,
}