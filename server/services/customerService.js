import { getAllCustomers, findByID, updateUser, forgotPassword, removeUser } from "../repos/userRepository.js";

//Read
export const getAllCust = async () => {
    const payload = await getAllCustomers();

    if (!payload || payload.length === 0) {
        const error = new Error("No customers found.");
        error.statusCode = 404;
        throw error;
    }

    return {
        customers: payload
    }
}

export const getByID = async (id) => {
    const payload = await findByID(id);

    if (!payload) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    return {
        user: payload
    }
}

//Update
export const updateCustomerProfile = async (id, updates) => {
  const payload = await updateUser(id, updates);
  if (!payload) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  return {
    message: "Profile updated successfully.",
    user: payload,
  };
};

export const updatePassword = async (username, password) => {
    const payload = await forgotPassword(username, password);

    if (!payload) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    if (payload === "Password already in use") {
        const error = new Error("Please choose a different password.");
        error.statusCode = 422;
        throw error;
    }

    return {
        message: "Password updated successfully.",
        user: payload
    }
}

//Delete
export const deleteUser = async (id) => {
    const payload = await removeUser(id);

    if (!payload) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    return {
        message: `${payload.username} removed successfully.`
    };
}
