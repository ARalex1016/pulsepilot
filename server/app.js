import express from "express";
import cookieParser from "cookie-parser";

// Routes
import authRouter from "./Routes/auth.route.js";
import postRouter from "./Routes/post.route.js";
import analyticRouter from "./Routes/analytics.route.js";
import connectedAccountsRouter from "./Routes/connected-accounts.route.js";

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/posts/", postRouter);
app.use("/api/v1/", analyticRouter);
app.use("/api/v1/accounts", connectedAccountsRouter);

export default app;
