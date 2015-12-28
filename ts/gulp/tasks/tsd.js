var gulp = require('gulp');
var tsd = require("gulp-tsd");
var config = require('../config');

gulp.task("tsd", function (callback) {
    tsd({
        command: "reinstall",
        config: config.tsd.json
    }, callback);
});