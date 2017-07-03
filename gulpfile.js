
'use strict';
//加载模块
var gulp=require('gulp');
var $=require('gulp-load-plugins')();//根据依赖关系自动加载插件
var browserSync=require('browser-sync').create();

//创建一个全局变量，用来定义目录路径

var app={
	srcPath:'src/',//源码source
	devPath:'build/',//构建build，便于测试
	prdPath:'dist/'//发布distribution
};

//html复制压缩
gulp.task('html',function(){
	gulp.src(app.srcPath+'**/*.html')
	.pipe(gulp.dest(app.devPath))
	.pipe($.htmlmin({
		collapseWhitespace:true,//去除空格换行
		removeComments:true,//去除注释
		removeEmptyAttributes:true//删除空的属性
	}))
	.pipe(gulp.dest(app.prdPath))
	.pipe(browserSync.stream());//浏览器同步更新

});

//less编译、压缩
gulp.task('less',function(){
	gulp.src(app.srcPath+'style/demo1.less')
	.pipe($.less())
	.pipe($.autoprefixer({
		  browsers: ['last 20 versions'],//兼容主流浏览器的最新2个版本
          cascade: false//是否没话属性值，默认值是true
	}))
	.pipe(gulp.dest(app.devPath+'css'))
	.pipe($.cssmin())
	.pipe(gulp.dest(app.prdPath+'css'))
	.pipe(browserSync.stream());

});


//concat，js合并任务
gulp.task('js',function(){
	gulp.src(app.srcPath+'script/*.js')
	.pipe($.concat('all.js'))//合并
	.pipe(gulp.dest(app.devPath+'js'))
	.pipe($.uglify())//压缩混淆
	.pipe(gulp.dest(app.prdPath+'js'))
	.pipe(browserSync.stream());
});

//图片压缩,对png有效
gulp.task('image',function(){
	gulp.src(app.srcPath+'images/*')
	.pipe($.imagemin())
	.pipe(gulp.dest(app.devPath+'images/'))
	.pipe(gulp.dest(app.prdPath+'images/'))
	.pipe(browserSync.stream());

});

//清空之前的内容
gulp.task('clean',function(){
	gulp.src([app.devPath,app.prdPath])
	.pipe($.clean())
	.pipe(browserSync.stream());
});




//定义一个监视任务，监视文件的变化
gulp.task('watch',['html','less','js','image'],function(){
	gulp.watch(app.srcPath+'**/*.html',['html']);//监视src目录下所有的html 文件，当发生变化时自动执行html任务
	gulp.watch(app.srcPath+'style/*.less',['less']);
	gulp.watch(app.srcPath+'script/*.js',['js']);
	gulp.watch(app.srcPath+'images/*',['image']);
});


//启动browser－sync静态服务器，实现浏览器同步
// gulp.task('serve',['html','less','js','image','watch'],function(){
gulp.task('default',['watch'],function(){
	browserSync.init({
		server:{
			baseDir:app.devPath
		},
	});
});

