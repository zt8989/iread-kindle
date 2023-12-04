const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
var ejs = require("gulp-ejs")
var gulpServer = require('gulp-webserver');
var less = require('gulp-less');
var path = require('path')
var LessAutoprefix = require('less-plugin-autoprefix');
require('dotenv').config({ path: '.env.' + (process.env.NODE_ENV || "development") })

gulp.task('default', () =>
    gulp.src('app-src/**/*')
        .pipe(babel())
        .pipe(gulp.dest('app/js'))
);

function watchJs(){
    return watch('app-src/**/*.js', { ignoreInitial: true, verbose: true })
        .pipe(babel())
        .pipe(gulp.dest('app'))
}

function watchHtml(){
    return watch('app-src/**/*.html', { ignoreInitial: true, verbose: true })
        .pipe(ejs({
            process: process
        }))
        .pipe(gulp.dest('app'))
}

function watchCss(){
    return watch('app-src/**/*.less', { ignoreInitial: true, verbose: true })
    .pipe(less({
        plugins: [new LessAutoprefix()],
        paths: [ path.join(__dirname, 'node_modules', 'normalize.css') ]
    }))
    .pipe(gulp.dest('app'))
}

function startServer() {
	return gulp.src("app/")
		.pipe(gulpServer({
			port: 8080,//端口号
			host: "0.0.0.0",//主机名
			livereload: true,//是否热更新
			open: true,//是否打开浏览器
		}))
}

gulp.task('watch', gulp.parallel(watchJs, watchHtml, watchCss, startServer))