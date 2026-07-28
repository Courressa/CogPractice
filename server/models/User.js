export class User {
    #id
    #username;
    #password;
    #isAdmin;
    
    constructor(id, username, password, isAdmin = false) {
        // Prevent direct instantiation
        if (new.target === User) {
            throw new TypeError("Cannot instantiate abstract class 'User' directly.");
        };

        this.#id = id;
        this.#username = username;
        this.#password = password;
        this.#isAdmin = isAdmin;
    };

    getId() {
        return this.#id;
    };

    setId(id){
        this.#id = id;
    };

    getUsername() {
        return this.#username;
    };

    setUsername(username) {
        this.#username = username;
    };

    getPassword() {
        return this.#password;
    };

    setPassword(password) {
        this.#password = password;
    };

    getIsAdmin() {
        return this.#isAdmin;
    };

    setIsAdmin(isAdmin) {
        this.#isAdmin = isAdmin;
    };
};