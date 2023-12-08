const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
var ejs = require("gulp-ejs")
var gulpServer = require('gulp-webserver');
var less = require('gulp-less');
var path = require('path')
var LessAutoprefix = require('less-plugin-autoprefix');
const {createGulpEsbuild} = require('gulp-esbuild')
const webpack = require('webpack-stream');

require('dotenv').config({ path: '.env.' + (process.env.NODE_ENV || "development") })

const gulpEsbuild = createGulpEsbuild({ incremental: true })

function buildJs(){
    return gulp.src('app-src/js/app.js')
        .pipe(babel())
        .pipe(
            webpack({
                mode: process.env.NODE_ENV || "development",
                output: {
                    filename: "app.js"
                },
                module: {
                    rules: [
                        {
                        test: /\.m?js$/,
                        exclude: /(node_modules)/,
                        use: {
                            loader: 'babel-loader',
                        }
                        }
                    ]
                }
            })
          )
        .pipe(gulp.dest('app/js'))
}

gulp.task('default', buildJs);

function watchJs(){
    return gulp.watch('app-src/**/*.js', { ignoreInitial: false },
    gulp.series(buildJs))
}

function watchHtml(){
    return watch('app-src/**/*.html', { ignoreInitial: false, verbose: true })
        .pipe(ejs({
            process: process
        }))
        .pipe(gulp.dest('app'))
}

function watchCss(){
    return watch('app-src/**/*.less', { ignoreInitial: false, verbose: true })
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

gulp.task('watch', gulp.parallel(watchJs, watchHtml, watchCss))

gulp.task('watch-server', gulp.parallel(watchJs, watchHtml, watchCss, startServer))