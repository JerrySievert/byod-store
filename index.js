var fs = require('fs');
var path = require('path');
var Readable = require('stream').Readable;
var util = require('util');

// implementation of a simple stream to read directories
// inherit from a readable stream
util.inherits(DirectoryStream, Readable);

// streams the contents of a directory as a key/value pair
function DirectoryStream (options) {
  // make sure to set to objectMode, this allows for key/value as objects
  options.objectMode = true;

  // inherit from Readable
  Readable.call(this, options);

  // save the directory path
  this._directory = options.directory;

  // a list of all of the files in said directory
  this._files = fs.readdirSync(this._directory);
}

DirectoryStream.prototype._read = function _read ( ) {
  // if there are no more files to read from, close out the stream
  if (this._files.length === 0) {
    this.push(null);
  } else {
    // a key consists of the directory, the path separator, and filename
    var key = this._directory + path.sep + this._files.shift();

    // horrible hack
    var self = this;

    fs.readFile(key, function _readFileCallback (err, data) {
      var obj = JSON.parse(data);

      self.push({ key: key, value: obj });
    });
  }
};

// base Store object
function Store (config) {
  // save the configuration
  this.config = config;

  // set the directory to either what is in the configuration, or current directory
  this.directory = (config && config.directory) || process.cwd();
}

// write a file to the directory, the key is the filename, and the value is
// the contents.
Store.prototype.add = function add (key, value, callback) {
  var filename = this.directory + path.sep + key;
  var string;

  try {
    string = JSON.stringify(value);
  } catch (err) {
    callback("Unable to encode JSON object: " + err);
  }

  fs.writeFile(filename, string, callback);
};

// in the case of an update, just call "add" - we can treat it as the same thing
// for a simple update.
Store.prototype.update = Store.prototype.add;

Store.prototype.get = function get (key, callback) {
  var filename = this.directory + path.sep + key;

  fs.readFile(filename, function getCallback (err1, data) {
    // if there is an error, just return it directly - no file, or permissions error typically
    if (err1) {
      callback(err1);
    } else {
      // attempt to decode the JSON
      try {
        var ret = JSON.parse(data);
        callback(null, ret);
      } catch (err2) {
        callback("Unable to decode JSON object: " + err2);
      }
    }
  });
};

// delete an entry
Store.prototype.del = function del (key, callback) {
  var filename = this.directory + path.sep + key;

  try {
    fs.unlinkSync(filename);
  } catch (err) {
    // silently ignore any errors
  }

  callback();
};

// returns a stream for scanning a directory
Store.prototype.scan = function scan ( ) {
  // return a new DirectoryStream, that uses events data/end
  return new DirectoryStream({ directory: this.directory });
};

module.exports = exports = Store;
