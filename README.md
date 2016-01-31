# Build Your Own Database - Store

This code is part of a blog series at http://legitimatesounding.com/.

## Using

```
$ npm install
```

### Running Tests

```
$ npm test
```

### Using

```js
var Store = require('byod-store');

var db = new Store({ directory: 'myDirectory' });

store.add("book", {
  "title": "A Simple Document",
  "chapters": [
    "one",
    "two",
    "three"
  ]
}, function (err) {
  // check for error
});
```
