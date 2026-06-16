import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";

import connectDB from "./config/db";
import { env } from "./config/env";
import errorMiddleware from "./config/middlewares/error.middleware";
import {
  requestLogger,
  responseLogger,
} from "./config/middlewares/logger.middleware";
import notFoundMiddleware from "./config/middlewares/not-found.middleware";

import routes from "./routes";

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
    origin: [env.CLIENT_URL, env.TEMP_CLIENT],

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser(env.COOKIE_SECRET));
app.use(hpp());
app.use(compression());
app.use(
  express.json({
    limit: "10kb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);
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
app.use(requestLogger);
app.use(responseLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,

    message: "Server healthy",
  });
});

app.use("/api", routes);
app.use(errorMiddleware);
app.use(notFoundMiddleware);

const start = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("[SERVER]", error);

    process.exit(1);
  }
};

void start();

export default app;
