var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    svgSprite = require('gulp-svg-sprites');

gulp.task('build', function() { // Retrieves dependencies; run this after install
    /* ----------------------------------------
    Lightning Design System
    ---------------------------------------- */
    gulp.src('node_modules/@salesforce-ux/design-system/assets/**/*')
        .pipe(gulp.dest('assets'));
    
    gulp.src('node_modules/@salesforce-ux/design-system/scss/_design-tokens.scss')
        .pipe(gulp.dest('scss'));
    
    /* ----------------------------------------
    Appiphony Lightning JS
    ---------------------------------------- */
    gulp.src('node_modules/appiphony-lightning-js/dist/**/*.js')
        .pipe(gulp.dest('js'));
    
    /* ----------------------------------------
    Moment.js
    ---------------------------------------- */
    gulp.src('node_modules/moment/moment.js')
        .pipe(gulp.dest('js'));
    
    gulp.src('node_modules/moment/min/**/*.js')
        .pipe(gulp.dest('js'));
    
    /* ----------------------------------------
    SVG for Everybody
    ---------------------------------------- */
    gulp.src('node_modules/svg4everybody/dist/**/*.js')
        .pipe(gulp.dest('js'));
});

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

gulp.task('uglify', function() {
    return gulp.src(['js/**/*.js', '!js/**/*.min.js'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
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
    gulp.watch(['css/**/*.css', '!css/**/*.min.css'], ['cssnano']);
    gulp.watch(['js/**/*.js', '!js/**/*.min.js'], ['uglify']);
    gulp.watch('images/icons/**/*.svg', ['sprites']);
});

gulp.task('default', ['build', 'sass', 'cssnano', 'uglify', 'sprites', 'watch']);