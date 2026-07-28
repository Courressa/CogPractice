import Customer from "../models/Customer.js";
import Admin from "../models/Admin.js";

const users = new Map();

const adminUser = new Admin(1, "admin", "admin123");
const customer1 = new Customer(2, "test", "test123");
const customer2 = new Customer(3, "someUser", "someUser123");

users.set(adminUser.getUsername(), adminUser);
users.set(customer1.getUsername(), customer1);
users.set(customer2.getUsername(), customer2);

export const findByUsername = (username) => {
    return users.get(username) || null;
}

export const save = (user) => {
    users.set(user.getUsername(), user);
    return user;
}