var gulp = require('gulp');
var less = require('gulp-less');
var browserify = require('browserify');

gulp.task('less', function () {
    gulp.src('./less/*.less')
        .pipe(less())
        .on('error', function (e) {
            console.log(e)
        })
        .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('browserify' , function(){
    var b = browserify();

    gulp.src("./public/js/pages/*.js")
        .pipe(mangle())
        .pipe(gulp.dest("./public/js/build/"));
});

gulp.task('default', ['less','browserify']);
