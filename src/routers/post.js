const express = require("express");
const Post = require("../models/post"); //.PostModel;
const router = new express.Router();
const auth = require("../middleware/auth");
const Topic = require("../models/topic");

//for Create post
router.post("/posts", auth, async (req, res) => {
  const topic_id = await Topic.findOne({ blogTopic: req.body.blogTopic });

  if (!topic_id) {
    res.status(404).send("Blog Topic does not exist!");
  }

  const post = new Post({
    ...req.body,
    author: req.user._id,
    topicId: topic_id._id,
  });

  try {
    await post.save();
    res.status(201).send(post);
  } catch (e) {
    res.status(400).send(e);
  }
});

//for edit post
router.patch("/posts/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["blogTopic", "description", "content"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Edits!" });
  }

  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
    });
    // const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send();
    }

    updates.forEach((update) => (post[update] = req.body[update]));

    await post.save();
    res.send(post);
  } catch (e) {
    res.status(404).send(e);
  }
});

//for delete post
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    // const post = await Post.findByIdAndDelete(req.params.id);
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) {
      res.status(404).send();
    }
    res.send(post);
  } catch (e) {
    res.status(500).send();
  }
});

//for get all posts
router.get("/posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({}); //author: req.user._id
    res.send(posts);
  } catch (e) {
    res.status(500).send();
  }
});

//for get posts by topic
router.get("/postsByTopic/:id", auth, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    await topic.populate("posts");
    res.send(topic.posts);
  } catch (e) {
    res.status(500).send();
  }
});

//for get most recent post
router.get("/recentPost", auth, async (req, res) => {
  try {
    const post = await Post.find({}, [], {
      sort: {
        createdAt: -1,
      },
      limit: 1,
    });
    res.send(post);
  } catch (e) {
    res.status(500).send();
  }
});

//for like
router.get("/likePost/:id", auth, async (req, res) => {
  try {
    const likePost = await Post.findById(req.params.id);
    const validateLike = await likePost.likeAuthorId.filter(
      (authorId) => authorId.AuthorId.toString() === req.user._id.toString()
    );

    if (validateLike.length !== 0) {
      return res.status(400).send({ error: "User has already Liked" });
    }

    likePost.likes += 1;
    likePost.likeAuthorId = likePost.likeAuthorId.concat({
      AuthorId: req.user._id,
    });
    await likePost.save();
    res.send(likePost);
  } catch (e) {
    res.send(404).send(e, "Not Found");
  }
});

//for dislike
router.get("/dislikePost/:id", auth, async (req, res) => {
  try {
    const dislikePost = await Post.findById(req.params.id);
    const validateDislike = await dislikePost.dislikeAuthorId.filter(
      (authorId) => authorId.AuthorId.toString() === req.user._id.toString()
    );

    if (validateDislike.length !== 0) {
      return res.status(400).send({ error: "User has already Disliked" });
    }

    dislikePost.dislikes += 1;
    dislikePost.dislikeAuthorId = dislikePost.dislikeAuthorId.concat({
      AuthorId: req.user._id,
    });
    await dislikePost.save();
    res.send(dislikePost);
  } catch (e) {
    res.send(404).send(e, "Not Found");
  }
});
//for most liked
router.get("/mostLiked", auth, async (req, res) => {
  try {
    const post = await Post.find({}, [], {
      sort: {
        likes: -1,
      },
      limit: 1,
    });
    res.send(post);
  } catch (e) {
    res.status(500).send(e);
  }
});

//for comment on post
router.post("/comment/:postId", auth, async (req, res) => {
  try {
    const commentOnPost = await Post.findById(req.params.postId);
    console.log(commentOnPost);
    if (!commentOnPost) {
      return res.status(400).send({ error: "not valid post" });
    }
    commentOnPost.comments = commentOnPost.comments.concat({
      comment: req.body.comment,
      commentUserId: req.user._id,
    });

    await commentOnPost.save();
    res.send(commentOnPost);
  } catch (e) {
    res.status(404).send(e);
  }
});
module.exports = router;

// .sort({ createdAt: -1, limit: 1 })
//       .exec(function (error, post) {
//         res.send(post);
//       });
