/*
* @Author: Charles
* @Date:   2017-06-10 23:14:46
* @Last Modified by:   Charles
* @Last Modified time: 2017-06-14 23:22:12
*/


//命令集
//npm init
//npm install gulp --save-dev
//npm install gulp-connect --save-dev  开服务器包
//npm install gulp-less --save-dev  解析less
//npm install pump --save-dev 换pump文件流
//npm install gulp-uglify --save-dev 文件压缩
//npm install --save-dev gulp-babel
//npm install --save-dev babel-preset-es2015 es6转es5
//npm install gulp-concat --save-dev 合成文件


var gulp = require('gulp');
var connect = require('gulp-connect');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require('gulp-babel');
var concat = require('gulp-concat');


//转换html文件
gulp.task('html', function(){
    gulp.src('./src/index.html')
        .pipe(connect.reload())
        .pipe(gulp.dest('./dist'));//写入命令
});

//转换less文件
gulp.task('css',function(){
    gulp.src('./src/css/*.less')
        .pipe(less())
        .pipe(connect.reload())
        .pipe(gulp.dest('./dist/css'));
    gulp.src('./src/css/*.css')
        .pipe(connect.reload())
        .pipe(gulp.dest('./dist/css'));
})

//转换js文件
gulp.task('js', function(cb){
    pump([
            gulp.src('./src/js/*.js'),
            babel({presets: ['es2015']}),
            connect.reload(),
            uglify(),
            gulp.dest('./dist/js')
        ],
        cb
        );
});
    /*gulp.src('./src/js/*.js')
        .pipe(connect.reload())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
    gulp.src('./src/jsmin/*.js')
        .pipe(connect.reload())
        .pipe(gulp.dest('./dist/js'));*/

//监听文件
gulp.task('watch', function(){
    gulp.watch('./src/index.html', ['html']);
    gulp.watch('./src/css/*.less', ['css']);
    gulp.watch('./src/js/*.js', ['js']);
})

//开服务器
gulp.task('server', function(){
    connect.server({
        port: 8080,//修改端口号
        livereload: true//自动刷新浏览器
    });
})

gulp.task('default', ['html', 'css', 'js','watch', 'server']);