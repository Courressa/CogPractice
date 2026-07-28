import { getAllCustomers } from "../repos/userRepository";

const getAllCust = () => {
    const payload = await getAllCustomers();

    if (!payload) {
        const error = new Error("No customers found");
        error.statusCode = 404;
        throw error;
    }
    
    return {
        customers: payload
    }
}