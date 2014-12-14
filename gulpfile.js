var gulp = require('gulp');
var complexity = require('gulp-escomplex');
var reporter = require('gulp-escomplex-reporter-html');
var jshint = require('gulp-jshint');
var shell = require('gulp-shell');

var pack = require('./package.json');

gulp.task('complexity', function () {
  return gulp.src([
    'index.js',
    'gulpfile.js'
  ])
  .pipe(complexity({
    packageName: pack.name,
    packageVersion: pack.version
  }))
  .pipe(reporter())
  .pipe(gulp.dest("complexity"));
});

gulp.task('jshint', function () {
  gulp.src([
    'index.js'
  ])
  .pipe(jshint({
      lookup: true
    }))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});

gulp.task('test', shell.task([
  './node_modules/istanbul/lib/cli.js cover ./node_modules/vows/bin/vows --spec'
]));

gulp.task('default', [ 'test', 'jshint', 'complexity' ]);
