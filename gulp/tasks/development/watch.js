// generated on 2016-01-06 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import {watch as config}  from '../../config';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('watch', ['browserSync'], () => {

  browserSync.notify('Watching files...');

  gulp.watch('bower.json', ['wiredep', 'fonts']);
  gulp.watch(config.less, ['less']).on('change', reload);
/*  gulp.watch(config.scripts, ['scripts']).on('change', reload);*/
  gulp.watch(config.images, ['images']).on('change', reload);
  gulp.watch(config.fonts, ['fonts']).on('change', reload);
  gulp.watch(config.html, ['html']).on('change', reload);

});
