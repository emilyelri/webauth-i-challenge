const db = require('./data/dbConfig.js');

function get() {
    return db('users')
}

function getByUsername(username) {
    return db('users')
    .where({ username })
    .first()
}

function register(user) {
    return db('users')
    .select('id', 'username')
    .insert(user)
    .then(([id]) => get(id));
}

module.exports = {
    get,
    getByUsername,
    register
}