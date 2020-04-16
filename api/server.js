const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStorage = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const userRouter = require('../users/users-router.js');
const knexConnection = require('../data/dbConfig.js');

const server = express();

const sessionConfiguration = {
  name: "mysession",
  secret: process.env.COOKIE_SECRET || "secret cookie",
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    secure: process.env.NODE_ENV === "development" ? false : true, 
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true, 
  store: new KnexSessionStorage({
    knex: knexConnection,
    clearInterval: 1000 * 60 * 10,
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