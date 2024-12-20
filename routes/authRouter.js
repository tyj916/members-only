const { Router } = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../db/queries');
const authController = require('../controllers/authController');
const authRouter = Router();

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await db.getUserByUsername(username);

    if (!user) {
      return done(null, false, { message: "User doesn't exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch(err) {
    return done(err);
  }
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch(err) {
    done(null, err);
  }
});

authRouter.get('/sign-up', authController.renderSignUp);
authRouter.post(
  '/sign-up', 
  authController.validateSignUp, 
  authController.handleSignUp,
  passport.authenticate('local', {
    failureRedirect: '/log-in',
    failureMessage: true,
    successRedirect: '/',
  }),
);
authRouter.get('/log-in', authController.renderLogIn);
authRouter.post(
  '/log-in', 
  authController.validateLogIn, 
  authController.handleLogIn, 
  passport.authenticate('local', {
    failureRedirect: '/log-in',
    failureMessage: true,
    successRedirect: '/',
  }),
);
authRouter.get('/log-out', authController.handleLogOut);

module.exports = authRouter;