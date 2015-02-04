var gulp               = require('gulp');
var sass               = require('gulp-sass');
var compassImagehelper = require('..');


var paths = {
    images: 'images/**/*.+(jpeg|jpg|png|gif|svg)',
    sass: 'sass/**/*.scss'
};

gulp.task('compass-imagehelper', function (cb) {
    return gulp.src(paths.images)
            .pipe(compassImagehelper({
                // targetFile: '_generated-imagehelper.scss', // default target filename is '_compass-imagehelper.scss'
                // template: 'your-compass-imagehelper.mustache',
                images_path: 'images/',
                css_path: 'css/',
                prefix: 'icon--'
            }))
            .pipe(gulp.dest('sass'));
});

gulp.task('sass', function (cb) {
    return gulp.src('sass/main.scss')
            .pipe(sass({ errLogToConsole: true }))
            .pipe(gulp.dest('./css'));
});


gulp.task('watch', ['compass-imagehelper'], function () {
    gulp.watch(paths.images, ['compass-imagehelper']);
    gulp.watch(paths.sass, ['sass']);
});