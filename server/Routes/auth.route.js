import express from "express";

// Controllers
import {
  register,
  login,
  protect,
  checkAuth,
  logout,
  me,
} from "../Controllers/auth.controller.js";

let router = express.Router();

// ROUTES
router.post("/register", register);

router.post("/login", login);

router.post("/check-auth", protect, checkAuth);

router.post("/logout", logout);

router.get("/me", protect, me);

export default router;
