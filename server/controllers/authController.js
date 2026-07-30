import { registerCustomer as registerCustomerService, loginCustomer, loginAdmin } from "../services/authService.js";

const secretKey = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

export const registerCustomer = async (req, res) => {
    try {
        let { username, password, firstName, lastName, email } = req.body || {};
        username = username?.trim();
        password = password?.trim();
        firstName = firstName?.trim();
        lastName = lastName?.trim();
        email = email?.trim();

        if (!username || !password || !firstName || !lastName || !email) {
            return res.status(400).json({
                message: "All fields are required. Please ensure each field is filled in to continue."
            });
        }

        // Checks username requirements are met
        const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
        if (!usernameRegex.test(username.trim())) {
            return res.status(400).json({
                message: "Username must be 4-20 characters and contain only letters, numbers, or underscores."
            });
        }

        // Checks strength of password based on requirement 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
            });
        }

        // Checks if email is valid/follows correct convention
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address."
            });
        }

        const result = await registerCustomerService({ username, password, firstName, lastName, email });

        res.status(201).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message})
        }
        return res.status(500).json({ message: error.message || "Server error. Something went wrong" });
    }
};

export const customerLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const result = await loginCustomer(username, password);

        res.status(200).json(result);
    } catch (err) {
        console.log("Issue in authenticate user");
        res.status(401).json({ message: err.message ? err.message : "Login failed."  });
    }
}

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const result = await loginAdmin(username, password);

        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ message: err.message ? err.message : "Login failed."  });
    }
}