module.exports = function(ops) {
  var gulp = ops.gulp;
  var config = ops.config;

  var browserSync = ops.browserSync;

  if (!config.tasks.svgs) return;

  var lodash = require('lodash');
  var path = require('path');
  var changed = require('gulp-changed');

  var sources = lodash.map(config.tasks.svgs.src, function(src) {
    return path.join(src);
  });

  var paths = {
    src: sources,
    dest: path.join(config.dest, config.tasks.svgs.dest)
  };

  var svgsTask = function(cb) {
    var PROD = Boolean.parse(process.env.prod);
    var stream = gulp
      .src(paths.src)
      .pipe(changed(paths.dest))
      .pipe(gulp.dest(paths.dest));
    if (!PROD) stream = stream.pipe(browserSync.stream());
    return stream;
  };

  gulp.task('svgs', svgsTask);
  gulp.task('svgs:watch', ['svgs'], function() {
    return gulp.watch(paths.src, ['svgs']);
  });
  return svgsTask;
};
