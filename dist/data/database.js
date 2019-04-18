'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _database = require('./database.json');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbPath = './data/database.json';

var saveDatabase = function saveDatabase() {
  _fs2.default.writeFileSync(dbPath, JSON.stringify(_database2.default, null, 2));
};

var Database = function () {
  function Database() {
    _classCallCheck(this, Database);
  }

  _createClass(Database, [{
    key: 'add',
    value: function add(newData) {
      console.log('adding row');
      delete newData.unsavedChanges;
      var index = ++_database2.default.lastIndex;
      _database2.default.movies[index] = newData;
      try {
        saveDatabase();
      } catch (e) {
        return { message: 'Add failed:', Error: e.message };
      }
      return { message: 'Add succeeded.', data: _database2.default };
    }
  }, {
    key: 'save',
    value: function save(row, newData) {
      console.log('saving row');
      try {
        delete newData.unsavedChanges;
        if (!_database2.default.movies[row]) throw new Error('Row does not exist.');
        _database2.default.movies[row] = newData;
        console.log(_database2.default);
        saveDatabase();
      } catch (e) {
        return { message: 'Update failed:', Error: e.message };
      }
      return { message: 'Update succeeded.', data: _database2.default };
    }
  }, {
    key: 'get',
    value: function get() {
      console.log('returning data');
      return _database2.default;
    }
  }, {
    key: 'delete',
    value: function _delete(row) {
      try {
        if (!_database2.default.movies[row]) throw new Error('Row does not exist.');
        delete _database2.default.movies[row];
        saveDatabase();
      } catch (e) {
        return { message: 'Delete failed:', Error: e.message };
      }
      return { message: 'Delete succeeded.', data: _database2.default };
    }
  }]);

  return Database;
}();

exports.default = function () {
  return new Database();
};