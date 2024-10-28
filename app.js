require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const postsRouter = require('./routes/postsRouter');

const app = express();
app.set('view engine', 'ejs');
app.use(session({ 
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
  });
});
app.use(userRouter);
app.use(postsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express listening on port ${PORT}`));
