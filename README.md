# gulp-compass-imagehelper
> compass-imagehelper [Gulp](https://github.com/gulpjs/gulp) plugin for providing the compass imagehelper functions to node-sass enviroments.

This plugin generates a helper .scss file, which you have to @import into your own sass project. 
Inside the generated file is a sass map which contains all the image infos including a inlined data version. 
The default mustache template also outputs a %placeholders for each image.
Additional there are the following helper function which mimic the native functions from Compass:

## Supported Compass functions
* **inline-image($image):** Embeds the contents of an image directly inside your stylesheet
* **image-width($image):** Returns the width of the image found at the path supplied by $image
* **image-height($image)** Returns the height of the image found at the path supplied by $image
* **image-url($image, $only-path: false, $cache-buster: false)**  
  Generates a path to an asset found relative to the project's images directory.
  Passing a true value as the second argument will cause only the path to be returned instead of a url() function
  The third argument is used to control the cache buster on a per-use basis. When set to false no cache buster will be used. When true a md5-hash of the file is appended to the url. When a string, that value will be used as the cache buster.
* image-exists($image): Returns true if the image exists in our helper file.

## Install
```shell
npm install gulp-compass-imagehelper --save-dev
```

## Example Usage
```javascript
var compassImagehelper = require('gulp-compass-imagehelper');

gulp.task('compass-imagehelper', function () {
    return gulp.src('_sources/images/**/*.+(jpeg|jpg|png|gif|svg)', {base: '_sources/images'})
        .pipe(compassImagehelper({
            // template: 'your-compass-imagehelper.mustache',
            // default target filename is '_compass-imagehelper.scss'
            //targetFile: '_generated-imagehelper.scss',
            prefix: 'icon--'
        }))
        .pipe(gulp.dest('sass'));
});
```

## Options
* **template** Path to mustache template
* **targetFile** Result file name

## Template variables
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

### License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)