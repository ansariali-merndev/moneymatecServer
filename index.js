import cookieParser from "cookie-parser";
import express from "express";
import { authRouter } from "./router/auth.router.js";
import { env } from "./lib/env.js";
import { connectDB } from "./config/db.config.js";
import cors from "cors";
import { userMiddleware } from "./middleware.js";
import { rootRouter } from "./router/root.router.js";

const app = express();
const port = env.port;

console.log("Env: ", env.corsOrigin);
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/api", userMiddleware, rootRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
