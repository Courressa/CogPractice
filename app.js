
import readline from 'readline';
import { stdin as input, stdout as output } from 'process';

// Class Bank
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
        console.log(`Checking Account interest rate: ${(this.getInterestRate() * 100).toFixed(2)}%`);
    }
};

class SavingAccount extends Account {
    constructor (accountNumber, owner) {
        // Interest 3.5%
        super(accountNumber, owner, 0.035);
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
        console.log(`Saving Account interest rate: ${(this.getInterestRate() * 100).toFixed(2)}%`);
    }
};


const rl = readline.createInterface({ input, output });
const users = new Map();
const accounts = new Map();
let nextAccountNumber = 1;

const adminUser = new Admin("admin", "admin123");
const customer1 = new Customer("test", "test123");
const customer2 = new Customer("someUser", "someUser123");

users.set(adminUser.getUsername(), adminUser);
users.set(customer1.getUsername(), customer1);
users.set(customer2.getUsername(), customer2);

const askUser = (questionToAsk) => {
    return new Promise((resolve, reject) => {
        rl.question(questionToAsk, (answer) => {
            
            resolve(answer);
        });
    });
};

const login = async () => {
    const userlogin = await askUser("Please enter your username and password separated by a space ");

    const loginInfo = userlogin.trim().split(" ");
    const username = loginInfo[0];
    const password = loginInfo[1];

    const user = users.get(username);

    if (user && user.getPassword() === password) {
        return user;               // return the whole object
    }

    return null;
};

const redirect = async (user) => {
    if (!user) {
        console.log("Invalid login credentials.");
        return;
    } 
    
    if (user.getIsAdmin()) {
        await adminDashboard(user);
    } else {
        await userDashboard(user);
    }
}

const adminDashboard = (user) => {
    console.log(`Hi ${user.getUsername()}! Welcome to your admin dashboard!`);
    console.log("What would you like to do?");
    console.log("1. View your profile?");
}

const userDashboard = async (user) => {
    let inDashboard = true;

    while (inDashboard) {
        console.log(`\nHi ${user.getUsername()}! Welcome to your user dashboard!`);
        console.log("1. Create a checking account");
        console.log("2. Create a saving account");
        console.log("3. View your accounts");
        console.log("4. Log out");

        const userAction = await askUser("What would you like to do? (Please enter only a number from the list)\n\n");

        // Get the user's current accounts (or empty array if none)
        const userAccounts = accounts.get(user.getUsername()) || [];

        switch (userAction.trim()) {
            case "1":
                const checking = new CheckingAccount(nextAccountNumber++, user.getUsername());
                userAccounts.push(checking);
                accounts.set(user.getUsername(), userAccounts);

                console.log(`Checking account created! Account #${checking.getAccountNumber()}`);
                break;
            case "2":
                const saving = new SavingAccount(nextAccountNumber++, user.getUsername());
                userAccounts.push(saving);
                accounts.set(user.getUsername(), userAccounts);

                console.log(`Saving account created! Account #${saving.getAccountNumber()}`);
                break;
            case "3":
                if (userAccounts.length === 0) {
                    console.log("You have no accounts yet.");
                } else {
                    console.log("\nYour accounts:");
                    userAccounts.forEach((acc, index) => {
                        console.log(
                            `${index + 1}. Account #${acc.getAccountNumber()} | ` +
                            `Balance: $${acc.getBalance().toFixed(2)}`
                        );
                        acc.printInterestRate();
                    });
                }
                break;
            case "4":
                console.log("Have a good day!");
                inDashboard = false;
                break;
            default:
                console.log("Invalid option!");
                break;
        }
    }
}

// ======== Entry Point ======== //
const app = async () => {
    console.log("Welcome to the bank!");
    
    let running = true;

    while (running) {
        const user = await login();
        await redirect(user);

        const wantsToCont = await askUser("\nWould you like to continue? (Y/N) ");

        if (wantsToCont.trim().toUpperCase() === "N") {
            running = false;
            rl.close();
        }
    }
};

app().catch((err) => {
    console.error(err);
});
