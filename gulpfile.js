var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    svgSprite = require('gulp-svg-sprites');

gulp.task('build', function() {
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
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions', '> 5%', 'ie 9', 'ie 8'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('css'));
});

//gulp.task('add-qa-locators', function() {
//    return gulp.src('qa-processing/**/*.html')
//        .pipe(dom(function() {
//            var document = this,
//            qaLocators = [
//                ['.slds-text-heading--label:not(.slds-list__item) + *:not(.slds-text-heading--medium):not(.slds-grid)', 'data-qa-display-value'],
//                ['.slds-notify, .slds-text-heading--label:not(.slds-list__item), label, legend, .slds-text-heading--small, .slds-text-heading--medium, .slds-text-heading--large, .slds-text-heading--label:not(.slds-tabs--default__item):not(.slds-tabs--scoped__item)', 'data-qa-label'],
//                ['a:not(.slds-button):not(.slds-tabs--default__link):not(.slds-tabs--scoped__link)', 'data-qa-link'],
//                ['button, .slds-tabs--default__link, .slds-tabs--scoped__link, .slds-has-list-interactions > .slds-list__item', 'data-qa-button'],
//                ['input:not([type="radio"]):not([type="checkbox"]), textarea', 'data-qa-input'],
//                ['select, .slds-picklist:not(.slds-picklist--multi) > .slds-button:first-child, .slds-dropdown-trigger > .slds-button:first-child', 'data-qa-select'],
//                ['input[type="radio"], input[type="checkbox"]', 'data-qa-checkbox'],
//                ['.slds-box, .slds-card, .slds-modal, .slds-modal__header, .slds-modal__content, .slds-modal__footer, .slds-tabs--default__content, .slds-tabs--scoped__content', 'data-qa-section']
//            ];
//        
//            String.prototype.camelize = function() {
//                return this.replace(/(?:[-_ ])(\w)/g, function(_, character) {
//                    return character ? character.toUpperCase() : '';
//                });
//            }
//            
//            function createQaLocators(selector, dataAttribute) {
//                Array.prototype.forEach.call(document.querySelectorAll(selector), function(el) {
//                    var value = (el.id) ? (el.id).camelize() : 'defaultValue';
//                    if (!el.hasAttribute(dataAttribute)) { el.setAttribute(dataAttribute, value); }
//                });
//            }
//            
//            for (i = 0; i < qaLocators.length; i++) {
//                createQaLocators(qaLocators[i][0], qaLocators[i][1]);
//            }
//        
//            return document;
//        }))
//        .pipe(gulp.dest('qa-processing'));
//});

gulp.task('cssnano', function() {
    return gulp.src(['css/**/*.css', '!css/**/*.min.css'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano({
            discardUnused: { fontFace: false }
        }))
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