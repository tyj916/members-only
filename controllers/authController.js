const { body, validationResult } = require('express-validator');

function renderLogIn(req, res) {
  res.render('user/logIn');
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
  renderLogIn,
  validateLogIn,
  handleLogIn,
  handleLogOut,
}