# gulp-compass-imagehelper
> [Gulp](https://github.com/gulpjs/gulp) plugin for generate data uri stylesheet from set of images.


### Install
```shell
npm install gulp-compass-imagehelper --save-dev
```

###Example
```javascript
var compassImagehelper = require('gulp-compass-imagehelper');

gulp.task('compass-imagehelper', function () {
    return gulp.src('_sources/images/**/*.+(jpeg|jpg|png|gif|svg)', {base: '_sources/images'})
        .pipe(compassImagehelper())
        .pipe(gulp.dest('sass'));
});
```

### Options
* **template** Path to mustache template
* **targetFile** Result file name

### Template variables
* **items** Array of images data
* **items[i].data** Data URI string
* **items[i].width** Image width in pixels;
* **items[i].height** Image height in pixels;
* **items[i].type** File Extension;
* **items[i].basename** Filename without extension;
* **items[i].path** Filepath relative to the project's images directory
* **items[i].fullname** Same as path, but '/' replaced by '-'
* **items[i].mime** MIME-Type of the file
* **items[i].hash** MD5 Hash of the file
