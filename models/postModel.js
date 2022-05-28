const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
