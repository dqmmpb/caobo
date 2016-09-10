// generated on 2016-01-06 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import {rev as config}  from '../../config';

const $ = gulpLoadPlugins();


gulp.task('rev-hash:js', () => {

  browserSync.notify('Rev replace');

  var jsfilter = $.filter(config.production.jsfilter, {restore: false});

  return gulp.src(config.production.src)
    .pipe(jsfilter)
    .pipe(gulp.dest(config.production.dest));

});

gulp.task('rev-hash:css', () => {

  browserSync.notify('Rev replace');

  var cssfilter = $.filter(config.production.cssfilter, {restore: false});

  return gulp.src(config.production.src)
    .pipe(cssfilter)
    .pipe(gulp.dest(config.production.dest));

});

gulp.task('rev-hash:html', () => {

  browserSync.notify('Rev replace');

  var nojscssfilter = $.filter(config.production.nojscssfilter, {restore: false});

  return gulp.src(config.production.src)
    .pipe(nojscssfilter)
    .pipe(gulp.dest(config.production.dest));

});

gulp.task('rev-hash', () => {

  return gulp.src(config.production.hash.src)
    .pipe($.revHash(config.production.hash))
    .pipe(gulp.dest(config.production.hash.dest));

});

gulp.task('rev-hash:sequence', (cb) => {

  browserSync.notify('Building Rev');

  $.sequence('rev-hash:js', 'rev-hash:css', 'rev-hash:html', 'rev-hash', cb);
});
