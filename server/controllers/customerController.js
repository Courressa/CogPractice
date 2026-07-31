import mongoose from "mongoose";
import { getAllCust, getByID, updateCustomerProfile, deleteUser } from "../services/customerService.js";

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

export const getUserByID = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "A valid user ID is required" });
        }

        const result = await getByID(id);

        res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message})
        }

        return res.status(500).json({ message: error.message || "Server error. Something went wrong" });
    }
}

export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "A valid user ID is required" });
        }

        const result = await updateCustomerProfile(id, req.body);
        res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

export const delUser = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "A valid user ID is required" });
        }

        const result = await deleteUser(id);

        res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message})
        }

        return res.status(500).json({ message: error.message || "Server error. Something went wrong" });
    }
}

