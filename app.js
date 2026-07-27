
import readline from 'readline';
import { stdin as input, stdout as output } from 'process';

const exampleUsers = new Map();

exampleUsers.set("admin", "admin123");
exampleUsers.set("test", "test123");
exampleUsers.set("someUser", "someUser123");

const askUser = (questionToAsk) => {
    const rl = readline.createInterface({ input, output });

    return new Promise((resolve, reject) => {
        rl.question(questionToAsk, (answer) => {
            rl.close();
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


// Entry point
const app = async () => {
    console.log("Welcome to the bank!");
    const loggedInUsername = await login();

    if (loggedInUsername === "") {
        console.log("Invalid login credentials.");
    } else {
        console.log(loggedInUsername);
        return loggedInUsername;
    }
};

app().catch((err) => {
    console.error(err);
});
