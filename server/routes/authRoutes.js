import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { registerCustomer, customerLogin, adminLogin, updateUserPassword } from "../controllers/authController.js";

const router = express.Router();

//POST - /api/v1/auth/register - register customer - PUBLIC
router.post("/register", registerCustomer);

//POST - /api/v1/auth/login - login customer - PUBLIC
router.post("/login", customerLogin);

//POST - /api/v1/auth/admin/login - admin login - PUBLIC
router.post("/admin/login", adminLogin);

//PATCH - /api/v1/auth/password - update user passsword based on id - PRIVATE
router.patch("/password", authMiddleware, updateUserPassword);

export default router;