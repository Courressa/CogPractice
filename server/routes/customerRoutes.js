import express from "express";
import { getAllCustomersCont, getUserByID, updateCustomer, updateUserPassword, delUser } from "../controllers/customerController.js";

const router = express.Router();

//GET - /api/v1/customers - get all customers - PUBLIC (for now)
router.get("/", getAllCustomersCont);

//GET - /api/v1/customers/:id - get customer by ID - PUBLIC
router.get("/:id", getUserByID);

//PUT - /api/vi/customers/:id - update customer profile - PUBLIC
router.put("/:id", updateCustomer);

//PATCH - /api/v1/customers/:username/password - update customer passsword based on username - PUBLIC
router.patch("/:username/password", updateUserPassword);

//DELETE - /api/v1/customers/:id - delete customer by ID - PUBLIC (for now)
router.delete("/:id", delUser);

export default router;

