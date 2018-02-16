var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var sassGlob = require('gulp-sass-glob');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var svgSprites = require('gulp-svg-sprites');
var mergeStream = require('merge-stream');
var runSequence = require('run-sequence');

gulp.task('build:dependencies', () => {
    /* ----------------------------------------
    Salesforce Lightning Design System
    ---------------------------------------- */
    var slds = gulp.src('./node_modules/@salesforce-ux/design-system/assets/**/*')
        .pipe(gulp.dest('./assets'));
    
    var tokens = gulp.src([
            './node_modules/@salesforce-ux/design-system/design-tokens/dist/**/*.default.scss',
            '!node_modules/@salesforce-ux/design-system/design-tokens/dist/{s1,force}*.scss'
        ])
        .pipe(rename({ prefix: '_' }))
        .pipe(gulp.dest('./scss/design-tokens'));
    
    /* ----------------------------------------
    Appiphony Lightning JS
    ---------------------------------------- */
    var aljs = gulp.src('./node_modules/appiphony-lightning-js/dist/**/*.js')
        .pipe(gulp.dest('./js'));
    
    /* ----------------------------------------
    SVG for Everybody
    ---------------------------------------- */
    var svg4everybody = gulp.src('./node_modules/svg4everybody/dist/**/*.js')
        .pipe(gulp.dest('./js'));
    
    return mergeStream(slds, tokens, aljs, svg4everybody);
});

gulp.task('build:tokenMaps', () => {
    return gulp.src('./scss/design-tokens/**/*')
        .pipe(replace(/(\$(?!mq-)(.*?): )(?:.*?);/g, function(match, groupOne, groupTwo) {
            var camelCaseValue = groupTwo.replace(/-([a-z])/g, function(match, character) {
                    return character ? character.toUpperCase() : '';
                });
            
            return groupOne + 't(' + camelCaseValue + ');';
        }))
        .pipe(gulp.dest('./scss/design-token-maps'));
});

gulp.task('compile:sass', () => {
    return gulp.src('./scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass({
            outputStyle: 'expanded'
        })
        .on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 5%', 'ie 10'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css'));
});

gulp.task('minify:css', () => {
    return gulp.src(['./css/**/*.css', '!./css/**/*.min.css'])
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano({
            discardUnused: {
                fontFace: false
            }
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('minify:js', () => {
    return gulp.src(['./js/**/*.js', '!./js/**/*.min.js'])
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./js'));
});

gulp.task('build:svgSprites', function () {
    return gulp.src('./images/icons/project/*.svg')
        .pipe(svgSprites({ mode: 'symbols' }))
        .pipe(gulp.dest('./images/icons/project-sprite'));
});

gulp.task('init:watch', () => {
    gulp.watch('./scss/**/*.scss', ['compile:sass']);
    gulp.watch(['./css/**/*.css', '!./css/**/*.min.css'], ['minify:css']);
    gulp.watch(['./js/**/*.js', '!./js/**/*.min.js'], ['minify:js']);
    gulp.watch('./images/icons/**/*.svg', ['build:svgSprites']);
});

gulp.task('default', ['build:dependencies'], () => {
    return runSequence('build:tokenMaps', 'compile:sass', ['minify:css', 'minify:js', 'build:svgSprites', 'init:watch']);
});