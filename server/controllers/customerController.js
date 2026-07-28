import { getAllCust } from "../services/customerService.js";

export const getAllCustomersCont = async (req, res) => {
    try {
        const result = await getAllCust();

        res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message})
        }

        return res.status(500).json({ message: error.message || "Server error. Something went wrong" });
    }
} 

