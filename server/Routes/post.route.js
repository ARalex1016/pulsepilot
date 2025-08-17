import express from "express";

// Controller
import {
  createPost,
  getPosts,
  getPostById,
  editPost,
  deletePost,
} from "../Controllers/post.controller.js";
import { protect } from "../Controllers/auth.controller.js";

// Middleware
import { postIdParamHandler } from "../Middleware/param.middleware.js";
import { checkPostOwnership } from "../Middleware/checkPostOwnership.js";

const router = express.Router();

router.param("postId", postIdParamHandler);

// PARAM MIDDLEWARE
router.post("/", protect, createPost);

// ROUTES
router.get("/", protect, getPosts);

router.get("/:postId", getPostById);

router.patch("/:postId", protect, checkPostOwnership, editPost);

router.delete("/:postId", protect, checkPostOwnership, deletePost);

export default router;
