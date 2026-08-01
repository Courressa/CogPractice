import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import healthRouter from "./routes/healthRoutes.js";
import customerRouter from "./routes/customerRoutes.js"
import connectDB from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CORS CONFIG =====
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://student-courressamalcolm-bank-frontend.s3-website-us-east-1.amazonaws.com"
  ],
}));

// Parse JSON
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Lambda safety: if body arrived as a string/Buffer, parse it
app.use((req, res, next) => {
  if (req.body == null || req.body === "") {
    req.body = {};
  } else if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString("utf8"));
    } catch {
      req.body = {};
    }
  } else if (typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body);
    } catch {
      // leave as-is
    }
  }
  next();
});

app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customers", customerRouter);

// Required for Lambda (server/lambda.js)
export default app;

// Local only (Lambda sets LAMBDA_TASK_ROOT)
if (!process.env.LAMBDA_TASK_ROOT) {
  (async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}