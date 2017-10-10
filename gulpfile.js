"use strict";

// TODO: add del package for deleting old files for production

/*** Start of gulp plugins ***/

const gulp = require('gulp'),
  gulpIf = require('gulp-if'),
  pug = require('gulp-pug'),
  less = require('gulp-less'),
  postcss = require('gulp-postcss'),
  sourcemaps = require('gulp-sourcemaps'),
  connect = require('gulp-connect'),
  browserSync = require('browser-sync');

/*** End of gulp plugins ***/


/*** Start of project input and output paths ***/

var isDev = process.env.NODE_ENV == 'development',

  baseDir = __dirname,

  frontEnd = `${baseDir}/frontend/`,
    inputLayouts = `${frontEnd}/components/index.pug`,
    inputStyles = `${frontEnd}/styles/`,

  build = `${baseDir}/build/`,
    outputStyles = `${build}/styles/`;

/*** End of project input and output paths ***/

/*** Start of layouts task ***/

gulp.task('layouts', () => {
  return gulp.src(inputLayouts)
    .pipe(pug())
    .pipe(gulp.dest(build));
});

/*** End of layouts task ***/

/*** Start of styles task ***/

gulp.task('styles', () => {
  return gulp.src(`${inputStyles}/main.less`)
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(less())
    .pipe(postcss())
    .pipe(gulpIf(isDev, sourcemaps.write('./')))
    .pipe(gulp.dest(outputStyles));
});

/*** End of styles task ***/

/*** Start of connect task ***/

gulp.task('connect', (done) => {
  // connect.server({
  //   root: build,
  //   port: 3000
  // });

  browserSync.init({
    server: {
      baseDir: build
    }
  });
  done();
});

/*** End of connect task ***/

/*** Start of watch task ***/

gulp.task('watch', (done) => {
  gulp.watch( [`${frontEnd}/components/**/*.less`, `${inputStyles}/**/*.less`], gulp.series('styles') );
  gulp.watch(`${frontEnd}/components/**/*.pug`, gulp.series('layouts'));
  done();
});

/*** End of watch task ***/

gulp.task('default', gulp.series(
  gulp.parallel('layouts', 'styles'),
  'connect',
  'watch'), (done) => {
    done();
});
