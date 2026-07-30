import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findByUsername, findByEmail, save, sanitize } from "../repos/userRepository.js";

const secretKey = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// Register
export const registerCustomer = async (data) => {
    const { username, email, password, ...otherData } = data;

    const existingUsername = await findByUsername(username);
    if (existingUsername) {
        const error = new Error("This username already exists.");
        error.statusCode = 409;
        throw error;
    }

    const existingEmail = await findByEmail(email);
    if (existingEmail) {
        const error = new Error("This email is already associated with an account.");
        error.statusCode = 409;
        throw error;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const payload = await save({
        username,
        email,
        ...otherData,
        password: hashedPassword,
        isAdmin: false
    });

    return {
        message: "User created successfully.",
        user: payload
    }
}

// Login
const authenticateUser = async (username, password) => {
    const user = await findByUsername(username);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 401;
        throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        const error = new Error("Invalid login credentials");
        error.statusCode = 401;
        throw error;
    }

    if (!secretKey) {
        console.error("JWT_SECRET is not defined in environment variables");
        const error = new Error("Server configuration error");
        error.statusCode = 500;
        throw error;
    }

    // Removes password and contains frontend friendly ID
    const safe = sanitize(user);

    const token = jwt.sign(
        {
            id: safe.id,
            username: safe.username,
            isAdmin: safe.isAdmin
        },
        secretKey,
        { expiresIn: "24h" }
    );

    return {
        token,
        user: {
            ...safe
        }
    };
};

export const loginCustomer = async (username, password) => {
    const payload = await authenticateUser(username, password);

    return {
        message: "Login successful",
        ...payload,
    };
};

export const loginAdmin = async (username, password) => {
    const payload = await authenticateUser(username, password);
    
    if (!payload.user.isAdmin) {
        const error = new Error("This account does not have admin access.");
        error.statusCode = 403;
        throw error;
    }

    return {
        message: "Admin login successful",
        ...payload,
    };
};