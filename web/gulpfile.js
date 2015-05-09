var gulp = require('gulp');
var less = require('gulp-less');
var browserify = require('gulp-browserify');

gulp.task('less', function () {
    gulp.src('./less/*.less')
        .pipe(less())
        .on('error', function (e) {
            console.log(e)
        })
        .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('browserify' , function(){

    gulp.src("./public/js/pages/*.js")
        .pipe(browserify())
        .pipe(gulp.dest('./public/js/build/'));



});

gulp.task('default', ['less','browserify']);
