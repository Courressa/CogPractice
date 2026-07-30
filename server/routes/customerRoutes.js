import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { ownerOnlyMiddleware } from "../middleware/OwnerOnlyMiddleware.js";
import { ownerOrAdminMiddleware } from "../middleware/ownerOrAdminMiddleware.js";
import { getAllCustomersCont, getUserByID, updateCustomer, updateUserPassword, delUser } from "../controllers/customerController.js";

const router = express.Router();

//GET - /api/v1/customers - get all customers - PRIVATE - Admin access only
router.get("/", authMiddleware, adminMiddleware, getAllCustomersCont);

//GET - /api/v1/customers/:id - get customer by ID - PRIVATE - Owner or Admin access only
router.get("/:id", authMiddleware, ownerOrAdminMiddleware, getUserByID);

//PUT - /api/v1/customers/:id - update customer profile - PRIVATE - Owner access only
router.put("/:id", authMiddleware, ownerOnlyMiddleware, updateCustomer);

//PATCH - /api/v1/customers/:username/password - update customer passsword based on username - PUBLIC/PRIVATE?????
router.patch("/:username/password", authMiddleware, updateUserPassword);

//DELETE - /api/v1/customers/:id - delete customer by ID - PRIVATE - Admin access only
router.delete("/:id", authMiddleware, adminMiddleware, delUser);

export default router;

