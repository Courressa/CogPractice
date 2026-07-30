import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import healthRouter from "./routes/healthRoutes.js";
import customerRouter from "./routes/customerRoutes.js"
import connectDB from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// ===== CORS CONFIG =====
app.use(cors({ origin: true }));


app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customers", customerRouter);

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