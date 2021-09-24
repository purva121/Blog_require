const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const topicRouter = require("./routers/topic");
const postRouter = require("./routers/post");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(topicRouter);
app.use(postRouter);

app.listen(port, () => {
  console.log(`Server is up on Port ${port}`);
});

// const Post = require("./models/post");

// const main = async () => {
//   const post = await Post.findById("614afe83934145055bbadfab");
//   await post.populate("author");
//   console.log(post.author);
// };

// main();
