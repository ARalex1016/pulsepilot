import express from "express";

// Controllers
import {
  connectAccount,
  getAccounts,
  disconnectPlatform,
} from "../Controllers/connected-accounts.controller.js";
import { protect } from "../Controllers/auth.controller.js";

let router = express.Router();

// ROUTES
router.patch("/connect", protect, connectAccount);

router.get("/", protect, getAccounts);

router.patch("/disconnect", protect, disconnectPlatform);

export default router;
