import User from "../models/User.js";

// Helper – never return the password
export const sanitize = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  const { password, __v, _id, ...safe } = obj;
  return {
    id: _id?.toString?.() ?? _id,          // frontend-friendly "id"
    ...safe,
  };
};

export const getAllCustomers = async () => {
  const customers = await User.find({ isAdmin: false }).select("-password");
  return customers.map(sanitize);
};

export const findByID = async (id) => {
  const user = await User.findById(id).select("-password");
  return sanitize(user);
};

// returns account including password
export const findByIdWithPassword = async (id) => {
  return User.findById(id).lean();
};

// returns account including password
export const findByUsername = async (username) => {
  return await User.findOne({ username });
};

// returns account including password
export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findByUsernameExcludingId = async (username, excludeId) => {
  return await User.findOne({ username, _id: { $ne: excludeId } });
};

export const findByEmailExcludingId = async (email, excludeId) => {
  return await User.findOne({ email, _id: { $ne: excludeId } });
};

export const save = async ({ username, password, firstName = "", lastName = "", email = "", isAdmin = false }) => {
  try {
    const user = await User.create({
      username,
      password,
      firstName,
      lastName,
      email,
      isAdmin,
    });

    return sanitize(user);
  } catch (err) {
    // Surface duplicate-key races as proper HTTP-aware errors for the service layer
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      const error = new Error(
        field === "email"
          ? "This email is already associated with an account."
          : "This username already exists."
      );
      error.statusCode = 409;
      error.code = 11000;
      throw error;
    }
    throw err;
  }
};

export const updateUser = async (id, updates) => {
  // Only allow these fields to be updated
  const allowed = ["firstName", "lastName", "email", "username"];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }

  if (Object.keys(filtered).length === 0) {
    const user = await User.findById(id).select("-password");
    return sanitize(user);
  }

  try {
    const user = await User.findByIdAndUpdate(id, filtered, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    return sanitize(user);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      const error = new Error(
        field === "email"
          ? "This email is already associated with an account."
          : "This username already exists."
      );
      error.statusCode = 409;
      error.code = 11000;
      throw error;
    }
    throw err;
  }
};

export const changePassword = async (id, hashedPassword) => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    {
      returnDocument: "after",
      runValidators: true
    }
  ).select("-password");

  if (!updatedUser) return null;

  return sanitize(updatedUser);
};

export const removeUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user ? sanitize(user) : null;
};
