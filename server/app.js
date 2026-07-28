
import readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import express from "express";
import authRouter from "./routes/authRoutes.js";
import healthRouter from "./routes/healthRoutes.js";
import customerRouter from "./routes/customerRoutes.js"

const app = express();
app.use(express.json());

app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", customerRouter);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});