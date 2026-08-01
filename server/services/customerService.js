import {
  getAllCustomers,
  findByID,
  updateUser,
  removeUser,
  findByUsernameExcludingId,
  findByEmailExcludingId,
} from "../repos/userRepository.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

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
export const updateCustomerProfile = async (id, updates = {}) => {
  const allowed = ["firstName", "lastName", "email", "username"];
  const cleaned = {};

  for (const key of allowed) {
    if (updates[key] === undefined) continue;

    const value = typeof updates[key] === "string" ? updates[key].trim() : updates[key];

    if (value === "" || value === null) {
      const error = new Error(`${key} cannot be empty.`);
      error.statusCode = 400;
      throw error;
    }

    cleaned[key] = value;
  }

  if (cleaned.username !== undefined && !usernameRegex.test(cleaned.username)) {
    const error = new Error(
      "Username must be 4-20 characters and contain only letters, numbers, or underscores."
    );
    error.statusCode = 400;
    throw error;
  }

  if (cleaned.email !== undefined) {
    cleaned.email = cleaned.email.toLowerCase();
    if (!emailRegex.test(cleaned.email)) {
      const error = new Error("Please provide a valid email address.");
      error.statusCode = 400;
      throw error;
    }
  }

  if (cleaned.username !== undefined) {
    const existingUsername = await findByUsernameExcludingId(cleaned.username, id);
    if (existingUsername) {
      const error = new Error("This username already exists.");
      error.statusCode = 409;
      throw error;
    }
  }

  if (cleaned.email !== undefined) {
    const existingEmail = await findByEmailExcludingId(cleaned.email, id);
    if (existingEmail) {
      const error = new Error("This email is already associated with an account.");
      error.statusCode = 409;
      throw error;
    }
  }

  const payload = await updateUser(id, cleaned);
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
