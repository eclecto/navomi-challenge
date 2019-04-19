import express from 'express';
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import User from './auth/user';
const port = process.env.PORT || 5000;

import dotenv from 'dotenv';

dotenv.config();

import { check, validationResult }  from 'express-validator/check';

console.log('server says hello');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

import database from './data/database';
const db = database();

console.log('server is running');

/**
 *  Authentication/login flow
 */
app.post('/api/login', async(req, res) => {
  const { user, password } = req.body;
  const userInfo = await User.login(user, password);
  if(userInfo.Error) {
    res.status(400).json(userInfo);
  } else {
    res.cookie('token', userInfo.token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).json({ success: true });
  }
});

app.post('/api/signup', async(req, res) => {
  console.log('signup request detected');
  const { user, password } = req.body;
  const userInfo = await User.register(user, password);
  if(userInfo.Error) {
    res.status(400).json(userInfo);
  } else res.json({ success: true });
});

app.all('/api/logout', (req, res) => {
  res.cookie('token','', { httpOnly: true, maxAge: -1 }).send('No longer logged in');
});

/**
 *  Validation for movie requests
 */
const validate = [
  check('data.title', 'Title is required').exists(),
  check('data.release', 'Invalid or missing release date.')
    .exists()
    .custom(val => !isNaN(new Date(Number(val)).valueOf())),
  check('data.director', 'Director is required').exists(),
  check('data.rating', 'Missing or invalid rating. Must be between 1 and 5.')
    .exists()
    .custom((val) => val >= 1 && val <= 5)
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if(errors && errors.length) {
    res.status(422).json({ Error: errors.array() });
  } else next();
}

/*
 *  Movie database requests, all require authorization
 */

app.post('/api/add', User.auth, validate, checkValidation, (req, res) => {
  const returnMessage = db.add(req.body.data);
  res.send(returnMessage);
});

app.get('/api/get', User.auth, (req, res) => {
  console.log('get request');
  res.json(db.get());
});

app.post('/api/save', User.auth, validate, checkValidation, (req, res) => {
  const returnMessage = db.save(req.body.row, req.body.data);
  res.send(returnMessage);
});

app.post('/api/delete', User.auth, (req, res) => {
  const returnMessage = db.delete(req.body.row);
  res.send(returnMessage);
});

// Launch server
const httpsOptions = {
    key: fs.readFileSync('./ssl/cert.key'),
    cert: fs.readFileSync('./ssl/cert.pem')
}
const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('server running at ' + port);
    })