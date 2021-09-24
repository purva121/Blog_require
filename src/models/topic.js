const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    blogTopic: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

topicSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "topicId",
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
