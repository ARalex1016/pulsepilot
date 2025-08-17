// Model
import mongoose from "mongoose";
import User from "../Models/user.model.js";
import Post from "../Models/post.model.js";

export const postIdParamHandler = async (req, res, next, postId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid post ID format",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    req.post = post;

    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
