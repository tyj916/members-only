const { body, validationResult} = require('express-validator');
const db = require('../db/queries');

const alphaErr = 'must only contain letters.';
const nameLengthErr = 'must be between 1 and 20 characters.';

const validateUser = [
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

async function createUserGet(req, res) {
  res.render('user/signUp');
}

const createUserPost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('user/signUp', {
        errors: errors.array(),
      });
    }

    const { firstName, lastName, username, password } = req.body;
    res.redirect('sign-up');
  }
]

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
  createUserPost,
  logInGet,
  logOut,
  getUserDetails,
  joinMembershipGet,
}