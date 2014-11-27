var gulp = require("gulp");
var less = require('gulp-less');

gulp.task('less', function () {
    gulp.src('less/local.less')
        .pipe(less({compress: true}))
        .pipe(gulp.dest('css/'));
});
