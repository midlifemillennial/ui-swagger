const path = require('path');
const htmlreplace = require('gulp-html-replace');

module.exports = function(ops) {
  const gulp = ops.gulp;
  const config = ops.config;
  var browserSync = ops.browserSync;

  var paths = {
    src: path.join(config.app, config.tasks.html.src),
    dest: path.join(config.dest)
  };

  var htmlTask = function() {
    var PROD = Boolean.parse(process.env.prod);
    let BUILD_NUM = process.env.DRONE_BUILD_NUMBER || 'XX';
    var stream = gulp
      .src(paths.src)
      .pipe(
        htmlreplace({
          css: `/docs/styles/build.${BUILD_NUM}.css`,
          js: {
            src: [`/docs/js/app.bundle.build.${BUILD_NUM}.js`],
            tpl: '"%s",'
          }
        })
      )
      .pipe(gulp.dest(paths.dest));
    if (!PROD) {
      stream = stream.pipe(browserSync.stream());
    }
    return stream;
  };

  gulp.task('html', htmlTask);
  gulp.task('html:watch', ['html'], function() {
    return gulp.watch(paths.src, ['html']);
  });

  return htmlTask;
};
