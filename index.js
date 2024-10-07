const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Create a new HTML file named home.html with an <h1> tag
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'));
});

// Return all details from user.json file to the client as JSON format
router.get('/profile', (req, res) => {
  fs.readFile('./user.json', 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send({ message: "Error reading user data" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Modify /login route to accept username and password as JSON body parameter
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('./user.json', 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send({ message: "Error reading user data" });
      return;
    }

    const user = JSON.parse(data);

    if (user.username !== username) {
      res.status(400).json({
        status: false,
        message: "User Name is invalid"
      });
    } else if (user.password !== password) {
      res.status(400).json({
        status: false,
        message: "Password is invalid"
      });
    } else {
      res.json({
        status: true,
        message: "User Is valid"
      });
    }
  });
});

// Modify /logout route to accept username as parameter and display a logout message
router.get('/logout', (req, res) => {
  const username = req.query.username;

  if (!username) {
    res.status(400).send("<b>Username is required for logout.</b>");
  } else {
    res.send(`<b>${username} successfully logged out.</b>`);
  }
});

// Add error handling middleware to handle 500 errors
app.use((err, req, res, next) => {
  res.status(500).send("Server Error");
});

app.use('/', router);

// Listen on the specified port
const port = process.env.port || 8081;
app.listen(port, () => {
  console.log(`Web Server is listening at port ${port}`);
});
