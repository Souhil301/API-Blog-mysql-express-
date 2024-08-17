const compression = require('compression');
const express = require('express');
      PORT = 3100,
      app = express(),
      cors = require('cors');
      db = require('./configDB'),
      postsRouter = require('./routes/posts'),
      commentRouter = require('./routes/comments'),
      authRouter = require('./routes/user'),
      likeRouter = require('./routes/like'),
      bodyparser = require('body-parser');

require('dotenv').config();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(compression())
app.use(cors());


app.use('/api', postsRouter);
app.use('/comment', commentRouter);
app.use('/auth', authRouter);
app.use('/likes', likeRouter);

db.connect(function (err) {
    if (err) {
        console.log("Error in the connection");
        console.log(err);
    } else {
        console.log("Database Connected");
        app.locals.db = db;
    }
});

app.listen(PORT || process.env.PORT, () => {
    console.log(`app is running on port : ${PORT}`);
});
