require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const pgPool = require('./db/pool');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const postsRouter = require('./routes/postsRouter');
const db = require('./db/queries');

const app = express();
app.set('view engine', 'ejs');
app.use(session({ 
  store: new (require('connect-pg-simple')(session))({
    pool: pgPool,
    tableName: 'users_session',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,  
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.get('/', async (req, res) => {
  const allPosts = await db.getAllPosts();
  res.render('index', {
    user: req.user,
    posts: allPosts,
  });
});
app.use(userRouter);
app.use(postsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express listening on port ${PORT}`));
