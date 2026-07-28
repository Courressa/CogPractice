
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

//Abstract Class User: username, password, isAdmin:true/false
//Class Admin extends User
//Class Customer extends User

class User {
    constructor(username, password, {isAdmin = false} = {}) {
        // Prevent direct instantiation
        if (new.target === User) {
        throw new TypeError("Cannot instantiate abstract class 'User' directly.");
        }

        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
    }
}

class Admin extends User {
    constructor (username, password) {
        super(username, password, { isAdmin: true });
    }
}

class Customer extends User {
    constructor (username, password) {
        super(username, password);
    }
}

//Abstract Class Account
//CheckingsAccount extends Account
//SavingsAccount extends Account

//Interface AccountOperations: printInterestRate(), deposit, withdraw, transfer
//SavingsAccount always gives higher interest rate
app().catch((err) => {
    console.error(err);
});
