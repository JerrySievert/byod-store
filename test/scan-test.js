var vows = require('vows');
var assert = require('assert');

var Store = require('../index');

var fs = require('fs');
var path = require('path');

var dbDir = __dirname + path.sep + "db";
var store = new Store({ directory: dbDir });


vows.describe('Store Scan').addBatch({
  'When a scan is set up on a directory with key/value pairs': {
    topic: function ( ) {
      var self = this;

      store.add("foo", { "foo": "bar" }, function ( ) {
        store.add("bar", { "bar": "baz" }, function ( ) {
          self.callback(null, store.scan());
        });
      });
    },
    "A stream is returned": function (data) {
      assert.ok(data);
    },
    "That can then be enumerated": {
      topic: function (stream) {
        var self = this;

        var objs = [ ];

        stream.on("data", function (data) {
          objs.push(data);
        });

        stream.on("end", function ( ) {
          self.callback(null, objs);
        });
      },
      "With the correct results": function (objs) {
        assert.equal(objs.length, 2);

        if (objs[0].key === 'foo') {
          assert.deepEqual(objs[0].value, { "foo": "bar" });
          assert.deepEqual(objs[1].value, { "bar": "baz" });
        } else {
          assert.deepEqual(objs[1].value, { "foo": "bar" });
          assert.deepEqual(objs[0].value, { "bar": "baz" });
        }

        fs.unlinkSync(dbDir + path.sep + "foo");
        fs.unlinkSync(dbDir + path.sep + "bar");
      }
    }
  }
}).export(module);
