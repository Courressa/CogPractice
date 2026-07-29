import User from "../models/User.js";
import { getAllCustomers, findByID, save, forgotPassword, removeUser } from "../repos/userRepository.js";

// Create
export const createCustomer = async (username, password) => {
    const existing = await User.findOne({ username });

    if (existing) {
        const error = new Error("This username already exists.");
        error.statusCode = 409;
        throw error;
    }

    const payload = await save({ username, password, isAdmin: false });
    return {
        message: "User created successfully.",
        user: payload
    }
}


//Read
export const getAllCust = async () => {
    const payload = await getAllCustomers();

    if (!payload || payload.length === 0) {
        const error = new Error("No customers found.");
        error.statusCode = 404;
        throw error;
    }

    return {
        customers: payload
    }
}

export const getByID = async (id) => {
    const payload = await findByID(id);

    if (!payload) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    return {
        user: payload
    }
}

//Update
export const updatePassword = async (username, password) => {
    const payload = await forgotPassword(username, password);

    if (!payload) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    if (payload === "Password already in use") {
        const error = new Error("Please choose a different password.");
        error.statusCode = 422;
        throw error;
    }

    return {
        message: "Password updated successfully.",
        user: payload
    }
}

//Delete
export const deleteUser = async (id) => {
    const payload = await removeUser(id);

    if (!payload) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    return {
        message: `${payload.username} removed successfully.`
    };
}
