import { User } from "./User.js";

export default class Admin extends User {
    constructor (id, username, password) {
        super(id, username, password, true);
    };
};
