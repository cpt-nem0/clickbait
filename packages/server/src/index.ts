import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import leaderboardRouter from "./routes/leaderboard.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// CORS — env-driven allowlist
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
  })
);

// Trust proxy (Vercel / reverse proxy)
app.set("trust proxy", 1);

app.use(express.json({ limit: "10kb" }));

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});
app.use("/api", globalLimiter);

// Stricter rate limit for score submissions
const submitLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions, try again later" },
});
app.use("/api/leaderboard", submitLimiter);

app.use("/api/leaderboard", leaderboardRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Global error handler — never leak stack traces
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[clickbait-server] running on port ${PORT}`);
});
