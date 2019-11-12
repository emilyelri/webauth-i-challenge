const bcrypt = require('bcryptjs');
const db = require('./model');

module.exports = function restricted(req, res, next) {
    const { username, password } = req.headers;
  
    if (username && password) {
      db.getByUsername(username)
        .first()
        .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
            next();
          } else {
            res.status(401).json({ message: 'Invalid Credentials.' });
          }
        })
        .catch(err => res.status(500).json({ message: 'Unable to access requested page unless logged in.', error: err }));
    } else {
      res.status(400).json({ message: 'No credentials provided.' });
    }
  }