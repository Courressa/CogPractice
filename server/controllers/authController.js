import { registerCustomer as registerCustomerService, loginCustomer, loginAdmin } from "../services/authService.js";

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

        const result = await registerCustomerService({ username, password, firstName, lastName, email });

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