var vows = require('vows');
var assert = require('assert');

var Store = require('../index');

var fs = require('fs');
var path = require('path');

var dbDir = __dirname + path.sep + "db";


vows.describe('Store Delete').addBatch({
  'When an existing file is deleted': {
    topic: function ( ) {
      var store = new Store({ directory: dbDir });

      fs.writeFileSync(dbDir + path.sep + "foo", '{"foo": "bar"}');

      store.del("foo", this.callback);
    },
    "The file no longer exists": function ( ) {
      assert.throws(function ( ) {
        fs.unlinkSync(dbDir + path.sep + "foo");
      },
      function (err) {
        if (err instanceof Error) {
          return true;
        }
      });
    }
  }
}).export(module);
