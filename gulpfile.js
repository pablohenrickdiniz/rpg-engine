var gulp = require('gulp');
var concat = require('gulp-concat');
var terser = require('gulp-terser');
var strip = require('gulp-strip-comments');
var resolveDependencies = require('gulp-resolve-dependencies');


function es(){
    return gulp.src('./src/**/*.js')
        .pipe(resolveDependencies({
            pattern: /\* @requires [\s-]*(.*\.js)/g
        }))
        .pipe(concat('RPG.js'))
        .pipe(strip())
       // .pipe(terser())
        .pipe(gulp.dest('./'));
}

gulp.task('scripts',es);