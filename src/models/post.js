const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    blogTopic: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    postedOn: {
      type: Date,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likeAuthorId: [
      {
        AuthorId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    dislikes: {
      type: Number,
      default: 0,
    },
    dislikeAuthorId: [
      {
        AuthorId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    comments: [
      {
        comment: {
          type: String,
          trim: true,
        },
        commentUserId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Topic",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

//Post Model
