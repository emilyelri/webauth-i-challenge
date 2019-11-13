const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStorage = require('connect-session-knex')(session);
const server = express();
const authRouter = require('../auth/auth-router.js');
const userRouter = require('../users/users-router.js');
const knexConnection = require('../data/dbConfig.js');

const sessionConfiguration = {
    name: 'my-session',
    secret: process.env.COOKIE_SECRET || 'is it secret? is it safe?',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStorage({
      knex: knexConnection,
      clearInterval: 1000 * 60 * 10, // 10 minutes
      tablename: "user_sessions",
      sidfieldname: "id",
      createtable: true
    })
  };

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(session(sessionConfiguration));

server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.send('<h1>api up!</h1>')
});

module.exports = server;