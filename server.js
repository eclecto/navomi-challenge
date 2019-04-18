import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 5000;

import { check, validationResult }  from 'express-validator/check';
//const { sanitizeBody } = require('express-validator/filter');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import database from './data/database';
const db = database();

console.log('server is running');

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

app.post('/api/add', validate, checkValidation, (req, res) => {
  const returnMessage = db.add(req.body.data);
  res.send(returnMessage);
});

app.get('/api/get', (req, res) => {
  console.log('get request');
  res.json(db.get());
});

app.post('/api/save', validate, checkValidation, (req, res) => {
  const returnMessage = db.save(req.body.row, req.body.data);
  res.send(returnMessage);
});

app.post('/api/delete', (req, res) => {
  const returnMessage = db.delete(req.body.row);
  res.send(returnMessage);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

