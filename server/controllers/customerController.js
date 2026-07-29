import mongoose from "mongoose";
import { getAllCust, getByID, createCustomer, updateCustomerProfile, updatePassword, deleteUser } from "../services/customerService.js";

export const registerCustomer = async (req, res) => {
    try {
        const { username, password, firstName, lastName, email } = req.body || {};

        // Checks if content is in each field
        if (!username || !password || !firstName || !lastName || !email) {
            return res.status(400).json({ message: "All fields are required. Please ensure each field is filled in to continue." });
        }

        // Checks strength of password based on requirement 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
            });
        }

        const result = await createCustomer({ username, password, firstName, lastName, email });

        res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message})
        }
        return res.status(500).json({ message: error.message || "Server error. Something went wrong" });
    }
};

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

export const updateUserPassword = async (req, res) => {
    try {
        const usernameFromParams = req.params.username;
        const { username: usernameFromBody, password } = req.body || {};
        const username = usernameFromBody || usernameFromParams;

        // Checks if content is in username and password field
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Checks strength of password based on requirement 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(422).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
            });
        }

        const result = await updatePassword(username, password);

        return res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message})
        }

        return res.status(500).json({ message: error.message || "Server error. Something went wrong" });
    }
}

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

