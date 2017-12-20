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


/**
 * @name `gulp styles`
 * @description Creates stylesheet for production
 * @return {stream}
 */
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


/**
 * @name `gulp serve`
 * @description Creates a watcher and syncs browser
 */
gulp.task('serve', ['styles'], () => {
    browsersync.init({
        server: "./"
    });

    gulp.watch('./_src/sass/**/*.scss', ['styles']);
    gulp.watch('./*.html').on('change', reload);
});


/**
 * @name `gulp scripts`
 * @description Creates script files for production
 * @return {stream}
 */
gulp.task('scripts', () =>
    gulp.src('./_src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            // presets: ['@babel/env'] <-- does not work >.<
        }))
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
                // no usge of both space and tabs for indentation
                'no-mixed-spaces-and-tabs': 1,
                // white space character at the end of a line without any meaning
                'no-trailing-spaces': 1,
                // when ternary operator offers a simpler alterntive
                'no-unneeded-ternary': 1,
                // explain your code in case of doubt
                'require-jsdoc': 1,
                // to improve readability add a whitespace after comment character
                'spaced-comment': 1,
                // one space before and after arrow function arrows
                'arrow-spacing': 1,
                // class constructions which extend from classes need super()
                'constructor-super': 2,
                // ... also check for usage of this before any super()
                'no-this-before-super': 2,
                // error for reassingation of a var which was declared with const
                'no-const-assign': 2,
                // class members with duplicate names should be avoided
                'no-dupe-class-members': 2,
                // no need for constructor functions? omit them
                'no-useless-constructor': 1,
                // better use let or const for block instead of function scoping
                'no-var': 1,
                // ... and also check for never reassigned let variables
                'prefer-const': 1,
                // better use template literals instead of string concat
                'prefer-template': 1,
                // and also check for some useless string concat
                'no-useless-concat': 1
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./dev'))
        .pipe(gulp.dest('./js'))
);


/**
 * @name `gulp images`
 * @description Optimize images
 * @return {stream}
 */
gulp.task('images', () =>
    gulp.src('._src/img/**/*.+(gif|jpg|jpeg|png|svg)')
        .pipe(cache(imagemin([
                imagemin.gifsicle({
                    interlaced: true
                }),
                imagemin.jpegtran({
                    progressive: true,
                    arithmetic: true
                }),
                imagemin.optipng({
                    optimizationLevel: 7
                }),
                imagemin.svgo({
                    plugins: [{removeViewBox: true}]
                })
            ],
            {
                verbose: true
            }
        )))
        .pipe(gulp.dest('./images'))
);



// --- dev helping tasks ---

/**
 * @name `gulp clear-cache`
 * @description Removes cached items from gulp-cache
 */
gulp.task('clear-cache', () => cache.clearAll());

/**
 * @name `gulp clean`
 * @description Removes all files from /css, /js, /images
 */
gulp.task('clean', () => del(['./css/*', './js/*', './images/*']));

/**
 * @name `gulp clean:dry`
 * @description Indicates which files `gulp clean` would remove
 */
gulp.task('clean:dry', () => del(['./css/*', './js/*', './images/*'],
    {
        dryRun: true
    })
    .then(
        paths => console.log('Would delete these:\n', paths.join('\n'))
    )
);



/**
 * @name `gulp`, `gulp default`
 * @description Standard action
 */
gulp.task('default', ['styles', 'scripts']);
