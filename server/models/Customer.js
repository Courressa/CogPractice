import { User } from "./User.js";

export default class Customer extends User {
    constructor (username, password) {
        super(username, password);
    };
};