import User from "../models/User.js";

// Helper – never return the password
const sanitize = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  const { password, __v, ...safe } = obj;
  return {
    id: safe._id,          // frontend-friendly "id"
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

export const findByUsername = async (username) => {
  return await User.findOne({ username });
};

export const save = async ({ username, password, firstName = "", lastName = "", email = "", isAdmin = false }) => {
  const existing = await User.findOne({ username });
  if (existing) return "Username exists";

  const user = await User.create({
    username,
    password,
    firstName,
    lastName,
    email,
    isAdmin,
  });

  return sanitize(user);
};

export const updateUser = async (id, updates) => {
  // Only allow these fields to be updated
  const allowed = ["firstName", "lastName", "email", "username"];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }

  const user = await User.findByIdAndUpdate(id, filtered, {
    returnDocument: 'after',
    runValidators: true,
  }).select("-password");

  return sanitize(user);
};

export const forgotPassword = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) return null;

  if (user.password === password) return "Password already in use";

  user.password = password;
  await user.save();
  return sanitize(user);
};

export const removeUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user ? sanitize(user) : null;
};