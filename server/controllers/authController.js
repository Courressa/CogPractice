import { loginCustomer, loginAdmin } from "../services/authService.js";

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