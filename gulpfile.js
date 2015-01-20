var gulp = require('gulp')
	,sass = require('gulp-sass')
	,browserSync = require('browser-sync')
	,uncss = require('gulp-uncss')
	,cssmin = require('gulp-cssmin')


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    })
})

gulp.task('sass', function () {
    gulp.src('./scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./'));
});

gulp.task('build', function() {
	gulp.src('./style.css')
		.pipe(uncss({
            html: ['./index.html']
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist'));
})

gulp.task('browserSync', function () {
    return gulp.src("./*.{html,css,js}")
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch("./scss/**/*.scss", ['sass']);
    gulp.watch("./*.{html,css,js}", ['browserSync']);
});
