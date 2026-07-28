
import readline from 'readline';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });
const exampleUsers = new Map();

exampleUsers.set("admin", "admin123");
exampleUsers.set("test", "test123");
exampleUsers.set("someUser", "someUser123");

const askUser = (questionToAsk) => {
    return new Promise((resolve, reject) => {
        rl.question(questionToAsk, (answer) => {
            
            resolve(answer);
        });
    });
};

const login = async () => {
    const userlogin = await askUser("Please enter your username and password separated by a space ");

    const loginInfo = userlogin.split(" ");
    const username = loginInfo[0];
    const password = loginInfo[1];

    for (const [key, value] of exampleUsers) {
        if ((key === username) && (value === password)) {
            return username;
        }
    }

    return "";
};

const adminDashboard = (username) => {
    console.log(`Hi ${username}! Welcome to your admin dashboard!`);
    console.log("What would you like to do?");
    console.log("1. View your profile?");
}

const userDashboard = (username) => {
    console.log(`Hi ${username}! Welcome to your user dashboard!`);
    
}

// Entry point
const app = async () => {
    console.log("Welcome to the bank!");
    
    let running = true;

    while (running) {
        const loggedInUsername = await login();
        if (loggedInUsername === "") {
            console.log("Invalid login credentials.");
        } else if (loggedInUsername === "admin") {
            adminDashboard(loggedInUsername);
        } else {
            userDashboard(loggedInUsername);
        }

        const wantsToCont = await askUser("Would you like to continue? (Y/N) ");

        if (wantsToCont.toUpperCase() === "N") {
            running = false;
            rl.close();
        }
    
    }
};

//Class Bank
class Bank {
    // # Makes it private
    #id;
    #name;

    constructor(id, name) {
        this.#id = id;
        this.#name = name;
    }

    getId() {
        return this.#id;
    };

    setId(id) {
        this.#id = id;
    };

    getName() {
        return this.#name;
    }

    setName(name) {
        this.#name = name;
    }
}


//Abstract Class User: username, password, isAdmin:true/false
//Class Admin extends User
//Class Customer extends User

class User {
    #username;
    #password;
    #isAdmin;
    
    constructor(username, password, isAdmin = false) {
        // Prevent direct instantiation
        if (new.target === User) {
            throw new TypeError("Cannot instantiate abstract class 'User' directly.");
        };

        this.#username = username;
        this.#password = password;
        this.#isAdmin = isAdmin;
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

class Admin extends User {
    constructor (username, password) {
        super(username, password, true);
    };
};

class Customer extends User {
    constructor (username, password) {
        super(username, password);
    };
};


//Abstract Class Account
//CheckingsAccount extends Account
//SavingsAccount extends Account

//Interface AccountOperations: printInterestRate(), deposit, withdraw, transfer
//SavingsAccount always gives higher interest rate
class Account {
    #accountNumber;
    #balance;
    #owner;
    #interestRate;
    #createdAt;

    constructor(accountNumber, owner, interestRate, createdAt = new Date(), balance = 0) {
        if (new.target === Account) {
            throw new TypeError("Cannot instantiate abstract class 'Account' directly.");
        };

        this.#accountNumber = accountNumber;
        this.#balance = balance;
        this.#owner = owner;
        this.#interestRate = interestRate;
        this.#createdAt = createdAt;
    };

    getAccountNumber() {
        return this.#accountNumber;
    };

    getBalance() {
        return this.#balance;
    };

    getCreatedAt() {
        return this.#createdAt;
    };

    getOwner() {
        return this.#owner;
    };

    setOwner(owner) {
        this.#owner = owner;
    };

    getInterestRate() {
        return this.#interestRate;
    };

    setInterestRate(interestRate) {
        this.#interestRate = interestRate;
    };

    

    // _ is protected - still public since JS does not have protected
    _addToBalance(amount) {
        this.#balance += amount;
    }

    _subtractFromBalance(amount) {
        if (amount > this.#balance) throw new Error("Insufficient funds");
        this.#balance -= amount;
    }

    // ===== Simulated Interface: AccountOperations =====
    // These must be implemented by subclasses

    deposit(amount) {
        throw new Error("Method 'deposit()' must be implemented by subclasses.");
    }

    withdraw(amount) {
        throw new Error("Method 'withdraw()' must be implemented by subclasses.");
    }

    transfer(amount, targetAccount) {
        throw new Error("Method 'transfer()' must be implemented by subclasses.");
    }

    printInterestRate() {
        throw new Error("Method 'printInterestRate()' must be implemented by subclasses.");
    }
};

class CheckingAccount extends Account {
    constructor (accountNumber, owner) {
        // Interest 1%
        super(accountNumber, owner, 0.01);
    }

    deposit(amount) {
        if (amount <= 0) throw new Error("Deposit must be positive");
        this._addToBalance(amount);
    }

    withdraw(amount) {
        if (amount <= 0) throw new Error("Withdrawal must be positive");
        this._subtractFromBalance(amount);
    }

    transfer(amount, targetAccount) {
        this.withdraw(amount);
        targetAccount.deposit(amount);
    }

    printInterestRate() {
        console.log(`Checking interest rate: ${(this.getInterestRate() * 100).toFixed(2)}%`);
    }
}


app().catch((err) => {
    console.error(err);
});
