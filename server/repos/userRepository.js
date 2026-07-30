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

export const save = async ({ username, password, firstName = "", lastName = "", email = "", isAdmin = false }) => {
  const existingUsername = await User.findOne({ username });
  if (existingUsername) return "Username exists";

  const existingEmail = await User.findOne({ email });
  if (existingEmail) return "Email exists";

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