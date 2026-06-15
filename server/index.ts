import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";

import connectDB from "./config/db";
import { env } from "./config/env";
import {
  notFoundMiddleware,
  requestLogger,
  responseLogger,
} from "./config/middlewares";
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
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: [env.CLIENT_URL, env.TEMP_CLIENT],
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
    legacyHeaders: false,
    max: 100,
    message: {
      message: "Too many requests. Please try again later.",

      success: false,
    },
    standardHeaders: true,
    windowMs: 15 * 60 * 1000,
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    message: "Server healthy",
    success: true,
  });
});

app.use("/api", routes);

app.use(notFoundMiddleware);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
