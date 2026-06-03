import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";

import routes from "./routes";
import { env } from "./config/env";

import {
  notFoundMiddleware,
  requestLogger,
  responseLogger,
} from "./config/middlewares";
import connectDB from "./config/db";

const app = express();

app.disable("x-powered-by");

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(
  cors({
    origin: [env.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

connectDB();

app.use(hpp());
app.use(compression());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(requestLogger);
app.use(responseLogger);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,

      message: "Too many requests. Please try again later.",
    },
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server healthy",
  });
});

app.use("/api", routes);

app.use(notFoundMiddleware);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
