import { findByUsername, save } from "../repos/userRepository.js";

// Register
export const registerCustomer = async (data) => {
    const payload = await save({ ...data, isAdmin: false });

    if (payload === "Username exists") {
        const error = new Error("This username already exists.");
        error.statusCode = 409;
        throw error;
    }

    return {
        message: "User created successfully.",
        user: payload
    }
}

// Login
const authenticateUser = async (username, password) => {
    const user = await findByUsername(username);

    if (!user) {
        throw new Error("User not found.");
    }

    const passwordMatch = user.password === password;

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