'use strict';

// basics
const gulp         = require('gulp');

// styles
const sass         = require('gulp-sass');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');

// js
const babel        = require('gulp-babel');
const eslint       = require('gulp-eslint');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');

// images
const imagemin     = require('gulp-imagemin');
const cache        = require('gulp-cache');

// dev's little helpers
const sourcemaps   = require('gulp-sourcemaps');
const browsersync  = require('browser-sync').create();
const reload       = browsersync.reload;
const del          = require('del');


gulp.task('styles', () =>
    gulp.src('./_src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({
                browsers: ['last 3 version']
            }),
            cssnano({
                safe: true,
                minifyFontValues: {
                    removeQuotes: false
                }
            })
        ]))
        .pipe(sourcemaps.write('./dev'))
        .pipe(gulp.dest('./css'))
);

gulp.task('serve', ['styles'], () => {
    browsersync.init({
        server: "./"
    });

    gulp.watch('./_src/sass/**/*.scss', ['styles']);
    gulp.watch('./*.html').on('change', reload);
});


gulp.task('scripts', () =>
    gulp.src('./_src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(eslint({
            rules: {
                // no console.log statements
                'no-console': 1,
                // inside objects there must be a getter when a setter is given
                'accessor-pairs': 2,
                // don't omit curly braces even if there is just one statement
                'curly': 1,
                // enforce === and !==
                'eqeqeq': 2,
                // warn about alert(), prompt(), confirm()
                'no-alert': 1,
                // eval() is evil
                'no-eval': 2,
                // eval-like code execution e.g. in setTimeout()
                'no-implied-eval': 2,
                // no indentational whitespace is considered as an mistake
                'no-multi-spaces': 1,
                // no new Function() constructors
                'no-new-func': 2,
                // with statement is considered as an antipattern
                'no-with': 2,
                // we'd like to wrap all the IIFEs
                'wrap-iife': 1,
                // warn about unused vars
                'no-unused-vars': 1,
                // one true brace style
                'brace-style': 1,
                // indentation is consistent (4 spaces)
                'indent': 1,
                // space character before and after keywords
                'keyword-spacing': 2,
                // max line length should be 80
                'max-len': 1,
                // constructor names should start capitalized
                'new-cap': 1,


            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./dev'))
        .pipe(gulp.dest('./js'))
);

gulp.task('default', ['styles']);
