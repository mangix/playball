var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less', function () {
    gulp.src('./less/*.less')
        .pipe(less())
        .on('error', function (e) {
            console.log(e)
        })
        .pipe(gulp.dest('./public/stylesheets/'));


});

gulp.task('default', ['less']);
