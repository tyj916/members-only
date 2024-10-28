const express = require('express');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const postsRouter = require('./routes/postsRouter');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('index');
});
app.use(authRouter);
app.use(userRouter);
app.use(postsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express listening on port ${PORT}`));
