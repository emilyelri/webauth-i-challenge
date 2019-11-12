const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('./model.js');
const restricted = require('./restricted.js');

router.post('/register', validate, (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 12);
    credentials.password = hash;

    db.register(credentials)
    .then(user => {
        console.log(user);
        res.status(201).json({ message: 'New user registered successfully.' });
    })
    .catch(err => res.status(500).json({ message: 'Server Error: Failed to create new user.', error: err }));
})

router.post('/login', validate, (req, res) => {
    const { username, password } = req.body;

    db.getByUsername(username)
    .first()
    .then(user => {
        console.log(user)
        if (user && bcrypt.compareSync(password, user.password)) {
            console.log(`${user.username} logged in!`)
            res.status(200).json({ message:  `Welcome, ${user.username}!` });
        } else {
            res.status(401).json({ message: "Invalid credentials. Please try again." });
        }
    })
    .catch(err => res.status(500).json({ message: 'Server Error: Failed to log in.', error: err }))
})

router.get('/users', restricted, (req, res) => {
    db.get()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => res.status(500).json({ message: 'Server Error: Failed to fetch users.', error: err }))
})

//MIDDLEWARE
function validate (req, res, next) {
    const { username, password } = req.body;

    !req.body && res.status(400).json({ message: 'Please provide user credentials.'});
    !username && res.status(400).json({ message: 'Please provide username.'});
    !password && res.status(400).json({ message: 'Please provide user password.'});
    next();
}

module.exports = router;