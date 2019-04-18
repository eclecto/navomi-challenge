'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _check = require('express-validator/check');

var _database = require('./data/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 5000;

//const { sanitizeBody } = require('express-validator/filter');

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

var db = (0, _database2.default)();

console.log('server is running');

var validate = [(0, _check.check)('data.title', 'Title is required').exists(), (0, _check.check)('data.release', 'Invalid or missing release date.').exists().custom(function (val) {
  return !isNaN(new Date(Number(val)).valueOf());
}), (0, _check.check)('data.director', 'Director is required').exists(), (0, _check.check)('data.rating', 'Missing or invalid rating. Must be between 1 and 5.').exists().custom(function (val) {
  return val >= 1 && val <= 5;
})];

var checkValidation = function checkValidation(req, res, next) {
  var errors = (0, _check.validationResult)(req).formatWith(function (_ref) {
    var msg = _ref.msg;
    return msg;
  });
  if (errors && errors.length) {
    res.status(422).json({ Error: errors.array() });
  } else next();
};

app.post('/api/add', validate, checkValidation, function (req, res) {
  var returnMessage = db.add(req.body.data);
  res.send(returnMessage);
});

app.get('/api/get', function (req, res) {
  console.log('get request');
  res.json(db.get());
});

app.post('/api/save', validate, checkValidation, function (req, res) {
  var returnMessage = db.save(req.body.row, req.body.data);
  res.send(returnMessage);
});

app.post('/api/delete', function (req, res) {
  var returnMessage = db.delete(req.body.row);
  res.send(returnMessage);
});

app.listen(port, function () {
  return console.log('Listening on port ' + port);
});