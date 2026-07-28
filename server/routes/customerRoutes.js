import express from "express";
import { getAllCustomersCont } from "../controllers/customerController";

const router = express.Router();

//Get - /api/v1/customers - get all customers - PUBLIC (for now)
router.get("/customers", getAllCustomersCont);

export default router;

