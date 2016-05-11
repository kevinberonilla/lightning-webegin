var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    svgSprite = require('gulp-svg-sprites');

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions', '> 5%', 'ie 9', 'ie 8'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('css'));
});

gulp.task('cssnano', function() {
    return gulp.src(['css/**/*.css', '!css/**/*.min.css'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('css'));
});

gulp.task('sprites', function () {
    return gulp.src('images/icons/*.svg')
        .pipe(svgSprite({
            mode: 'symbols'
        }))
        .pipe(gulp.dest('images'));
});

gulp.task('watch', function() {
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('images/icons/**/*.svg', ['sprites']);
    gulp.watch(['css/**/*.css', '!css/**/*.min.css'], ['cssnano']);
});

gulp.task('default', ['sass', 'sprites', 'cssnano', 'watch']);