const express = require('express');
const userRouter = require('./routes/userRouter');
const postsRouter = require('./routes/postsRouter');

const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('index');
});
app.use(userRouter);
app.use(postsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express listening on port ${PORT}`));
