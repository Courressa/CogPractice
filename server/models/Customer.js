import { User } from "./User.js";

export default class Customer extends User {
    constructor (id, username, password) {
        super(id, username, password);
    };
};