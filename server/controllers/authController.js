import { registerCustomer as registerCustomerService, loginCustomer, updatePassword, loginAdmin } from "../services/authService.js";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

function handleAuthError(res, error, fallbackMessage = "Server error. Something went wrong") {
    if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message || fallbackMessage });
}

export const registerCustomer = async (req, res) => {
    try {
        let { username, password, firstName, lastName, email } = req.body || {};
        username = username?.trim();
        // Do not trim password — spaces may be intentional
        firstName = firstName?.trim();
        lastName = lastName?.trim();
        email = email?.trim();

        if (!username || !password || !firstName || !lastName || !email) {
            return res.status(400).json({
                message: "All fields are required. Please ensure each field is filled in to continue."
            });
        }

        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message: "Username must be 4-20 characters and contain only letters, numbers, or underscores."
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address."
            });
        }

        const result = await registerCustomerService({ username, password, firstName, lastName, email });

        res.status(201).json(result);
    } catch (error) {
        return handleAuthError(res, error);
    }
};

export const customerLogin = async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const result = await loginCustomer(username, password);

        res.status(200).json(result);
    } catch (err) {
        return handleAuthError(res, err, "Login failed.");
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const result = await loginAdmin(username, password);

        res.status(200).json(result);
    } catch (err) {
        return handleAuthError(res, err, "Login failed.");
    }
};

export const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body || {};

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required."
            });
        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                "New password must be at least 8 characters long and include uppercase, lowercase, and a number"
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: "New password must be different from the current password."
            });
        }

        // req.user comes from authMiddleware (JWT)
        const result = await updatePassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        return res.status(200).json(result);
    } catch (error) {
        return handleAuthError(res, error);
    }
};
