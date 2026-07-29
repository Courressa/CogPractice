import User from "../models/User.js";

export const findByUsername = (username) => {
    return User.findOne({ username });
};

export const findByID = (id) => {
    return User.findById(id).select("-password");
};

export const save = (user) => {
    return User.create(user).select("-password");
};

export const getAllCustomers = () => {
    const customers = User.find({ isAdmin: false }).select("-password");
    return customers;
};

export const forgotPassword = (username, newPassword) => {
    const user =  User.findOneAndUpdate(
        { username },                    // find this user
        { password: newPassword },       // change this field
        { new: true }                    // return the updated document
    ).select("-password").lean();

    return user; // null if user not found
};

export const removeUser = (id) => {
    return User.findByIdAndDelete(id);
};