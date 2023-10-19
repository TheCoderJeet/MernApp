import mongoose from "mongoose";

const createPostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  notifications: {
    type: Array,
    required: false,
    default: [],
  },
  likes: {
    type: Array,
    required: false,
    default: [],
  },
});

const Post = mongoose.model("POST", createPostSchema);

export default Post;
