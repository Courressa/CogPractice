import User from "../models/User.js";

export const findByUsername = (username) => {
    return User.findOne({ username });
};

export const findByID = (id) => {
    return User.findById(id).select("-password");
};

export const save = async ({ username, password, isAdmin = false }) => {
    await User.create({ username, password, isAdmin });
    return User.findOne({ username }).select("-password");
};

export const getAllCustomers = () => {
    return User.find({ isAdmin: false }).select("-password");
};

export const forgotPassword = async (username, newPassword) => {
    const getUser = await findByUsername(username);

    if (!getUser) return null;

    if (getUser.password === newPassword) {
        return "Password already in use";
    }

    return User.findOneAndUpdate(
        { username },                    // find this user
        { password: newPassword },       // change this field
        { returnDocument: "after" }      // return the updated document
    ).select("-password");
};

export const removeUser = (id) => {
    return User.findByIdAndDelete(id).select("username");
};