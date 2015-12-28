var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../config');

gulp.task('browserify', function(){
    return browserify(config.browserify.entry)
        .bundle()
        .pipe(source(config.browserify.output.filename))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.browserify.dest));
});