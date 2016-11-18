'use strict'

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const concatCss = require('gulp-concat-css');
const sourcemaps = require('gulp-sourcemaps');
const inject = require('gulp-inject');
const del = require('del');
const connect = require('connect');
const http = require('http');
const nodeStatic = require('node-static');
const runSequence = require('run-sequence');
const livereload = require('gulp-livereload');

gulp.task('connect', function () {
	var build = new nodeStatic.Server('./build');
	http.createServer(function (req, res) {
		build.serve(req, res);
	}).listen(8080);
	console.log('Server running on port 8080');
});

gulp.task('lib', function () {
	return gulp.src([
			'node_modules/angular/angular.js',
			'node_modules/ng-dialog/js/ngDialog.js'
		])
		.pipe(concat('lib.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/js'))
		.pipe(livereload());
});

gulp.task('js', function () {
	return gulp.src([
			'src/**/*.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('build/js'))
		.pipe(livereload());
});

gulp.task('css', function () {
	return gulp.src([
			'src/**/*.css',
			'node_modules/ng-dialog/css/ngDialog.css',
			'node_modules/ng-dialog/css/ngDialog-theme-default.css'
		])
		.pipe(concatCss('main.min.css', {
			rebaseUrls: false
		}))
		.pipe(cssmin())
		.pipe(gulp.dest('build/css'))
		.pipe(livereload());
});

gulp.task('templates', function () {
	return gulp.src('src/templates/**/*.html')
		.pipe(gulp.dest('build/templates'));
});

gulp.task('img', function () {
	return gulp.src(['src/img/logo/*.*', 'src/img/icon/*.*'], {
			base: "./src"
		})
		.pipe(gulp.dest('build/'));
});

gulp.task('index', function () {
	var sources = gulp.src(['build/js/lib.min.js', 'build/js/app.min.js', 'build/css/*.css'], {
		read: false
	});

	return gulp.src('./src/index.html')
		.pipe(inject(sources, {
			ignorePath: 'build'
		}))
		.pipe(gulp.dest('./build'))
		.pipe(livereload());
							
});

gulp.task('clean', function () {
	return del('build');
});

gulp.task('default', function (callback) {
	runSequence('clean', ['lib', 'js', 'css', 'templates', 'img'], ['index'], ['watch'], callback);
});


gulp.task('watch', function () {
	livereload.listen();
	gulp.watch('./src/css/*.css', ['css']);
	gulp.watch('./src/js/**/*.js', ['js']);
	gulp.watch('./src/templates/*.html', ['templates']);
	gulp.watch('./src/img/**/*.*', ['img']);
	gulp.watch('./src/index.html*', ['index']);
});