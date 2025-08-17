import express from "express";

// Controllers
import {
  getPostAnalytics,
  getSummary,
} from "../Controllers/analytics.controller.js";

let router = express.Router();

router.get("/posts/:id/analytics", getPostAnalytics);

router.get("/analytics/summary", getSummary);

export default router;
