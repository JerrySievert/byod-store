var vows = require('vows');
var assert = require('assert');

var Store = require('../index');

var fs = require('fs');
var path = require('path');

var dbDir = __dirname + path.sep + "db";


vows.describe('Store Update').addBatch({
  'When a key and value pair are updated over an existing file': {
    topic: function ( ) {
      var store = new Store({ directory: dbDir });

      fs.writeFileSync(dbDir + path.sep + "foo", '{"foo": "baz"}');

      store.update("foo", { "foo": "bar" }, this.callback);
    },
    "No error occurs": function (err) {
      assert.equal(err, null);
    },
    "A file is created that contains the correct data": function ( ) {
      var file = fs.readFileSync(dbDir + path.sep + "foo");
      var obj = JSON.parse(file);

      assert.equal(obj.foo, "bar");
    },
    "That can then be deleted": function ( ) {
      assert.doesNotThrow(function ( ) {
        fs.unlink(dbDir + path.sep + "foo");
      });
    }
  }
}).export(module);
