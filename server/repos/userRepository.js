import Customer from "../models/Customer.js";
import Admin from "../models/Admin.js";

const users = new Map();
let idIncrement = 4;

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
    //Prevents creating users with duplicate username
    if (!findByUsername(user.username)) {
        const assignedId = idIncrement++;
        user.setId(assignedId);
        users.set(user.getUsername(), user);
        return user;
    } else {
        return "Already exists";
    }
}

export const getUserProfile = (username) => {
    const user = users.get(username);
    if (!user) return null;

    return {
        id: user.getId(),
        username: user.getUsername(),
        isAdmin: user.getIsAdmin()
    };
}

export const getAllCustomers = () => {
    const customers = [];

    for (const [key, value] of users) {
        if (value.getIsAdmin() === false) {
            customers.push(getUserProfile(key));
        }
    }

    return customers;
}