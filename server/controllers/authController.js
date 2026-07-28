import { loginCustomer, loginAdmin, createCustomer } from "../services/authService.js";

export const registerCustomer = async (req, res) => {
    try {
        const { username, password } = req.body || {};

        // Checks if content is in username and password field
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Checks strength of password based on requirement 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
            });
        }

        const result = await createCustomer(req.body);

        res.status(200).json(result);
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