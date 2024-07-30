// server.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML)
app.use(express.static('public'));

// Route to display login form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle login
app.post('/login', (req, res) => {
    const userID = req.body.userID;

    // Get the list of valid USERIDs and USERNAMES from .env
    const validUserIDs = process.env.USERIDS.split(',');
    const userNameMap = process.env.USERNAMES.split(',').reduce((acc, entry) => {
        const [id, name] = entry.split(':');
        acc[id] = name;
        return acc;
    }, {});

    // Check if the provided USERID is in the list of valid USERIDs
    if (validUserIDs.includes(userID)) {
        const username = userNameMap[userID];
        // Send home.html with a personalized message
        res.sendFile(path.join(__dirname, 'home.html'));
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Login</title>
            </head>
            <body>
                <h1>Login</h1>
                <form action="/login" method="POST">
                    <label for="userID">UserID:</label>
                    <input type="text" id="userID" name="userID" required>
                    <button type="submit">Login</button>
                </form>
                <p style="color: red;">The UserID you provided is invalid. Please try again.</p>
            </body>
            </html>
        `);
    }
});

// Route to handle direct access to /login
app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Unauthorized Access</title>
        </head>
        <body>
            <h1>Unauthorized Access</h1>
            <p>To access the login page, go back to the <a href="/">homepage</a>.</p>
        </body>
        </html>
    `);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});