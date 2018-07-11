var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var merge = require('gulp-merge-json');
var mergeStream = require('merge-stream');




var paths = {
  sass: ['./scss/**/*.scss', './www/components/**/*.scss'],
  ng_annotate: ['./www/js/*.js', './www/app/*.js', './www/components/**/*.js'],
  templatecache: ['./www/*.html', './www/components/**/*.html'],
  useref: ['./www/*.html'],
  merge_json: ['./www/components/**/locales/*.json']
};

gulp.task('default', ['sass', 'templatecache', 'ng_annotate', 'useref','merge_json']);
gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('templatecache', function (done) {
  gulp.src(paths.templatecache)
    .pipe(templateCache({standalone: true}))
    .pipe(gulp.dest('./www/dist/dist_js'))
    .on('end', done);
});

gulp.task('ng_annotate', function (done) {
  gulp.src(paths.ng_annotate)
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest('./www/dist/dist_js/app'))
    .on('end', done);
});

gulp.task('useref', function (done) {
  // var assets = useref.assets();
  gulp.src('./www/*.html')
  // .pipe(assets)
  // .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('./www/dist'))
    .on('end', done);
});

gulp.task('merge_json', function (done) {
  var lan = ['de', 'en', 'fr', 'it'];
  var rp = './www/components/!**!/locales/';
  var tasks = [];
  for (var i = 0; i < lan.length; i++) {
    tasks.push(
      gulp.src('./www/components/**/locales/' + lan[i] + '.json')
        .pipe(merge({
          fileName: lan[i] + '.json'
        }))
        .pipe(gulp.dest('./www/dist_locales'))
    );
  }
  return mergeStream(tasks);


});


gulp.task('watch', ['sass','templatecache','ng_annotate','useref','merge_json'], function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templatecache, ['templatecache']);
  gulp.watch(paths.ng_annotate, ['ng_annotate']);
  gulp.watch(paths.useref, ['useref']);
  gulp.watch(paths.merge_json, ['merge_json']);
});



gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

