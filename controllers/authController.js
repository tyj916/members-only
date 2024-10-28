const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/queries');

async function logInGet(req, res) {
  res.render('user/logIn');
}

const validateLogIn = [
  body('username').trim()
    .isLength({ min: 1, max: 255}).withMessage('Username must not exceed 255 characters.'),
  body('password')
    .isLength({ min: 6 }).withMessage(`Password must be at least 6 characters`),
];

async function logInPost(req, res) {
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
}

async function logOut(req, res) {
  res.send('logout');
}

module.exports = {
  logInGet,
  validateLogIn,
  logInPost,
  logOut,
}