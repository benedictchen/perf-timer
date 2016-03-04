var gulp = require('gulp'),
    cached  = require('gulp-cached'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    mocha = require('gulp-mocha'),
    path = require('path'),
    istanbul = require('gulp-istanbul'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    chalk = require('chalk'),
    gitStaged = require('gulp-git-staged'),
    growl = require('growl'),
    jscs = require('gulp-jscs');

var MARGIN_SPACES = '\n\n\n\n';
var HORIZONTAL_BARS = '=';
for (var i=0; i < 80; i++) { HORIZONTAL_BARS += '='; }
var isWatching = false;

function errorHandler(error) {
    growl('ERROR: Tests failed.');
    console.error(MARGIN_SPACES);
    console.error(chalk.red(HORIZONTAL_BARS));
    console.error(chalk.red('ERROR INFORMATION:'));
    console.error(chalk.red(HORIZONTAL_BARS));
    console.error(chalk.red('CODE:'), error.code);
    console.error(chalk.red('NAME:'), error.name);
    console.error(chalk.red('MESSAGE:\n'));
    console.error(chalk.blue(error.message));
    console.error(chalk.red('STACK TRACE:\n'));
    console.error(chalk.white(error.stack));
    console.error(chalk.red(HORIZONTAL_BARS));
    console.error(MARGIN_SPACES);
    if (!isWatching) {
        process.exit(1);
    }
}

gulp.task('clean', function() {
   return del(['tmp/**/*', 'test/**/*', 'lib/**/*']);
});

gulp.task('test', ['es6', 'test_es6'], function () {
    console.log(chalk.blue(HORIZONTAL_BARS));
    console.log('Running tests...');
    return gulp.src(['lib/**/*.js'])
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src('test/**/*.js', {read: false})
                .pipe(mocha({
                    reporter: 'spec',
                }))
                .on('error', errorHandler)
                .pipe(istanbul.writeReports({
                  dir: './tmp/coverage-report',
                }));
        });
});

gulp.task('ci-test', ['es6', 'test_es6'], function () {
    console.log(chalk.blue(HORIZONTAL_BARS));
    console.log('Running tests...');
    return gulp.src(['lib/**/*.js'])
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src('test/**/*.js', {read: false})
                .pipe(mocha({
                    reporter: 'mocha-junit-reporter',
                    reporterOptions: {
                        mochaFile: './test-result.xml'
                    }
                }))
                .on('error', errorHandler)
                .pipe(istanbul.writeReports({
                   dir: './tmp/coverage-report',
                    reporters: [
                        'clover', 'lcov', 'json', 'text', 'text-summary'
                    ],
                }));
        });
});

gulp.task('jscs', function() {
    gulp.src(['src/**/*.js'])
        .pipe(jscs({
            fix: true
        }))
        .pipe(jscs.reporter())
        .pipe(gulp.dest('src'))
        .on('finish', function() {
            gulp.src(['test_src/**/*.js'])
                .pipe(jscs({
                    fix: true
                }))
                .pipe(jscs.reporter())
                .pipe(gulp.dest('test_src'));
        });
});

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', 'test_src/**/*.js'])
    .pipe(gitStaged())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', function(err){
        growl('ERROR: Linting failed.')
    });
});

function createTranspileTask(name, src, out) {
    gulp.task(name, function() {
        return gulp.src(src)
            .pipe(cached(name))
            .pipe(sourcemaps.init())
            .pipe(babel()).on('error', function (error) {
                console.log(error.toString());
                this.emit('end');
                // If transpiling fails, we need to stop everything
                // since tests and coverage reporting will continue
                // on old files and we'll never know what's wrong.
                growl('ERROR: Transpiling failed. Terminating process.');
                process.exit(1);
            })
            .pipe(sourcemaps.write('.', {
                includeContent: false,
                sourceRoot: path.join(__dirname, src.split('/')[0])
            }))
            .pipe(gulp.dest(out));
    });
}

createTranspileTask('es6', 'src/**/*.js', 'lib');
createTranspileTask('test_es6', 'test_src/**/*.js', 'test');

gulp.task('transpile', ['es6', 'test_es6']);

gulp.task('watch', ['es6', 'test_es6'], function() {
    gulp.watch('src/**/*.js', {ignoreInitial: false}, ['es6']);
    gulp.watch('test_src/**/*.js', {ignoreInitial: false}, ['test_es6']);
});

gulp.task('devtasks', ['transpile', 'test', 'lint']);

gulp.task('devwatch',  function() {
    isWatching = true;
    gulp.watch([ 'src/**/*.js', 'test_src/**/*.js' ], ['devtasks']);
});

gulp.task('default', ['es6', 'test_es6']);
