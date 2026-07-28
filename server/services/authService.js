import { findByUsername, save } from "../repos/userRepository.js";

export const createCustomer = async (user) => {
    const payload = await save(user);

    if (payload === "Already exists") {
        const error = new Error("This username already exists.");
        error.statusCode = 409;
        throw error;
    }

    return {
        message: "User created successfully.",
        username: payload.username
    }
}

const authenticateUser = async (username, password) => {
    const user = await findByUsername(username);

    if (!user) {
        throw new Error("User not found.");
    }

    const passwordMatch = (await user.getPassword()) !== password ? true : false;

    if (!passwordMatch) {
        throw new Error("Invalid login credentials.");
    }

    return {
        username: user.username,
        isAdmin: user.isAdmin,
    }
}

export const loginCustomer = async (username, password) => {
    const payload = await authenticateUser(username, password);

    return {
        message: "Login successful",
        ...payload,
    }
}

export const loginAdmin = async (username, password) => {
    const payload = await authenticateUser(username, password);
    
    if (!payload.isAdmin) {
        throw new Error("This account does not have admin access.")
    }

    return {
        message: "Admin login successful",
        ...payload,
    }
}