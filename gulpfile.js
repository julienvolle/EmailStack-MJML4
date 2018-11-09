/** 
 * Globals
 */
var ___PATH___ = {
	dn: "http://www.domain-name.com", // Domain Name
	root: "", // Root path (ex: "/www")
	public: "" // Public path (ex: "/emails/2018-05-19/")
}
var ___SERVER___ = {
	host: '', // Host Name
	port: '',	// Port
    user: '', // Login
    pass: '', // Password
    remotePath: ___PATH___.root + ___PATH___.public // Folder path
}



/** 
 * Gulp v4.0.0
 * > https://github.com/gulpjs/gulp/tree/master/docs/getting-started
 */
var gulp = require('gulp');



/** 
 * Gulp Util v3.0.8
 * > https://github.com/gulpjs/gulp-util
 */
var util = require('gulp-util');



/** 
 * Gulp Clean v0.4.0
 * > https://www.npmjs.com/package/gulp-clean
 */
var clean = require('gulp-clean');
function reset() {
	return gulp.src('dist/*', {
			read: false
		})
		.pipe(clean())
	;
}
exports.reset = reset;



/** 
 * Gulp Exec v3.0.2
 * > https://www.npmjs.com/package/gulp-exec
 *
 * FS v0.0.1-security
 * > https://www.npmjs.com/package/fs
 *
 * MJML v4.1.2
 * > https://mjml.io/documentation/#installation
 */
var exec = require('gulp-exec');
var fs = require('fs');
function mjml() {
	var folders = [
        'dist',
        'dist/images'
    ];
    folders.forEach(dir => {
		if(!fs.existsSync(dir)) {
	        fs.mkdirSync(dir);
	        console.log('📁 folder created:', dir);
	    }
    });
	var options = { 
		continueOnError: false, 
		pipeStdout: false, 
		customTemplatingThing: "test" 
	};
	var reportOptions = { 
		err: true, 
		stderr: true, 
		stdout: true 
	};
	return gulp.src('./src/index.mjml')
    	.pipe(util.env.mode === 'production' ? exec('mjml src/index.mjml -o dist/index.html --config.beautify=true --config.minify=true', options) : exec('mjml src/index.mjml -o dist/index.html', options) )
    	.pipe(exec.reporter(reportOptions))
    ;
}
exports.mjml = mjml;



/** 
 * Gulp Replace v1.0.0
 * > https://www.npmjs.com/package/gulp-replace
 */
var replace = require('gulp-replace');
function resolve() {
	return gulp.src('./dist/index.html')
    	.pipe(replace('src="./images', 'src="' + ___PATH___.dn + ___PATH___.public + '/images'))
    	.pipe(gulp.dest('./dist'))
    ;
}
exports.resolve = resolve;



/** 
 * Gulp ImageMin v4.1.0
 * > https://www.npmjs.com/package/gulp-imagemin
 *
 * ImageMin MozJpeg v7.0.0
 * > https://www.npmjs.com/package/imagemin-mozjpeg
 */
var imagemin = require('gulp-imagemin');
var mozjpeg = require('imagemin-mozjpeg');
function assets() {
	return gulp.src('./src/images/**/*')
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 0 }),
            imagemin.svgo({
		        plugins: [
		            { removeViewBox: true },
		            { cleanupIDs: false }
		        ]
		    }),
            mozjpeg({ quality: 100 })
        ], {
			verbose: true
		}))
    	.pipe(gulp.dest('./dist/images'))
    ;
}
exports.assets = assets;



/** 
 * Vinyl FTP v0.6.1
 * > https://www.npmjs.com/package/vinyl-ftp
 */
var ftp = require('vinyl-ftp');
function upload() {
	var conn = ftp.create({
	    host:     ___SERVER___.host,
	    user:     ___SERVER___.user,
	    password: ___SERVER___.pass,
	    parallel: ___SERVER___.port,
	    log:      util.log
	});
	var globs = [
	    'dist/**'
	];
	return gulp.src(globs, { base: './dist/', buffer: false })
        .pipe(conn.newer(___PATH___.root + ___PATH___.public))
        .pipe(conn.dest(___PATH___.root + ___PATH___.public))
    ;
}
exports.upload = upload;



/** 
 * Gulp Open v3.0.1
 * > https://www.npmjs.com/package/gulp-open
 */
var open = require('gulp-open');
function browser() {
	return gulp.src('./gulpfile.js')
  		.pipe(open({ 
  			uri: ___PATH___.dn + ___PATH___.public + '/'
  		}))
	;
}
exports.browser = browser;



/** 
 * Watch
 */
function watch() {
	gulp.watch('./src/*.mjml', gulp.series(mjml));
	gulp.watch('./src/images/**/*', gulp.series(assets));
}
exports.watch = watch;



/** 
 * Task
 */
var task;
if (util.env.mode === 'production') {
	task = gulp.series(reset, mjml, resolve, assets, upload, browser);
} else {
	task = gulp.series(reset, mjml, assets, watch);
}
gulp.task('default', task);
