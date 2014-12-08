var vows = require('vows');
var assert = require('assert');

var Store = require('../index');

var fs = require('fs');
var path = require('path');

var dbDir = __dirname + path.sep + "db";


vows.describe('Store Get').addBatch({
  'When a value is retrieved from an existing file': {
    topic: function ( ) {
      var store = new Store({ directory: dbDir });

      fs.writeFileSync(dbDir + path.sep + "foo", '{"foo": "bar"}');

      store.get("foo", this.callback);
    },
    "The object contains the correct data": function (data) {
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
