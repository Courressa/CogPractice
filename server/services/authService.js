import { findByUsername } from "../repos/userRepository.js";

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