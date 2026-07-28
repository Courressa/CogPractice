import express from "express";
import { customerLogin, adminLogin } from "../controllers/authController.js";

const router = express.Router();

//POST - /api/v1/auth/login - login customer - PUBLIC
router.post("/login", customerLogin);

//POST - /api/v1/auth/admin/login - login customer - PUBLIC
router.post("/admin/login", adminLogin);

export default router;