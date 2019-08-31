const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');
const shortcss = require('postcss-short');
const svgtofont = require('svgtofont');
const gulpCopy = require('gulp-copy');
const less = require('gulp-less');
// const babel = require('gulp-babel');
// const concat = require('gulp-concat');
// const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
// const cleanCSS = require('gulp-clean-css');
// const del = require('del');
sass.compiler = require('node-sass');

const sassFilePath = './sass/**/*.scss';
const lessFilePath = './less/**/*.less';
const lessPath = './less';
const tempCSSFilePath = './.css/**/*.css';// CSS 临时目录
const tempCSSPath = './.css';// CSS 临时目录
const fontLessPath = './fonts/**/*.less';
const destCSSPath = './css';

const svgPath = './svg/**/*.svg';


gulp.task('sass', function () {
  return gulp.src(sassFilePath)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(tempCSSPath));
});

gulp.task('sass:watch', function () {
  gulp.watch(sassFilePath, ['sass']);
});


gulp.task('less', function () {
  return gulp.src(lessFilePath)
    .pipe(less())
    .pipe(gulp.dest(tempCSSPath));
});

gulp.task('less:watch', function () {
  gulp.watch(lessFilePath, ['less']);
});


gulp.task('css', function () {
  const plugins = [
    shortcss,
    cssnext,
    autoprefixer({ browsers: ['> 1%'], cascade: false })
  ];
  return gulp.src(tempCSSFilePath)
    .pipe(postcss(plugins))
    .pipe(gulp.dest(destCSSPath));
});

gulp.task('css:watch', function () {
  gulp.watch(tempCSSFilePath, ['css']);
});



gulp.task('icon', function () {
  svgtofont({
    src: path.resolve(process.cwd(), 'svg'), // svg path
    dist: path.resolve(process.cwd(), 'fonts'), // output path
    fontName: 'svgtofont', // font name
    emptyDist: true,
    css: true, // Create CSS files.
  }).then(() => {
    console.log('done!');
  });
});

gulp.task('copy', function () {
  gulp
    .src(fontLessPath)
    .pipe(rename(function (myPath) {
      console.log(myPath);
      myPath.basename = '_' + myPath.basename;
      return myPath;
    }))
    .pipe(gulp.dest(lessPath));
});
gulp.task('font', function () {
  gulp
    .src([
      './fonts/**/*.eot',
      './fonts/**/*.svg',
      './fonts/**/*.ttf',
      './fonts/**/*.woff',
      './fonts/**/*.woff2'])
    // .pipe(rename(function (myPath) {
    //   console.log(myPath);
    //   myPath.basename = '_' + myPath.basename;
    //   return myPath;
    // }))
    .pipe(gulp.dest(destCSSPath));
});

gulp.task('svg:watch', function () {
  gulp.watch(svgPath, ['copy', 'font']);
});

gulp.task('default', ['sass:watch', 'less:watch', 'css:watch', 'svg:watch'], function () {
  console.log('start');
});
