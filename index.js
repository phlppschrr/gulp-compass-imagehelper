var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through');
var mustache = require('mustache');
var sizeOf = require('image-size');
var mime = require('mime');
var md5 = require('MD5');
var appRoot = require('app-root-path').path;

module.exports = function (options) {
    var images = [];
    //var images_path = options.images_path || '';

    if (!options) options = {};

    if(!options.template)
        options.template = path.join(__dirname, 'compass-imagehelper.mustache');

    if(!options.targetFile)
        options.targetFile = '_compass-imagehelper.scss';

    //if(!options.images_path)
    //    options.images_path = appRoot;

    //console.log(appRoot)

    // The full http path to images on the web server.
    //if (!options.http_images_path && options.relative_assets === true && options.images_path && options.css_path) {
    //    options.http_images_path = path.relative(options.css_path, options.images_path);
    //}
    //
    //if (!options.http_images_path){
    //    options.http_images_path = '';
    //}

    if(!options.prefix)
        options.prefix = '';


    var template = fs.readFileSync(options.template).toString();

    var pathPrefix = function () {
        var result = '';
        if (options.http_images_path) {
            result = options.http_images_path;
        } else if (options.css_path && options.images_path) {
            // relative path from css folder to images
            result = path.relative(options.css_path, options.images_path);
        } else if(options.images_path) {
            // relative from project url
            result = path.relative(appRoot, options.images_path);
        } else {
            // WARN:
        }
        // make sure pathPrefix ends with a trailing slash
        if (result && result.substr(-1) != '/') {
            result = result + '/';
        }
        return result;
    };


    var bufferContents = function (file) {
        if(!options.images_path) {
            // autodetect images_path with the first file
            options.images_path = path.relative( appRoot,  file.base);
        }

        var imageInfo = {};
        var data;
        var encoding;

        var mimetype = mime.lookup(file.path);
        var dimensions = sizeOf(file.path);

        imageInfo.width = dimensions.width;
        imageInfo.height = dimensions.height;
        imageInfo.mime = mimetype;
        imageInfo.filename = path.basename(file.path);
        imageInfo.basename = path.basename(file.path, path.extname(file.path));
        imageInfo.ext = path.extname(file.path);
        imageInfo.path = path.relative(options.images_path, file.path);
        imageInfo.fullname = imageInfo.path.split(path.sep).join('-').replace('.', '-');
        imageInfo.hash = md5(file.contents);
        if (mimetype == 'image/svg+xml') {
            data = encodeURIComponent(file.contents);
            encoding = 'utf8';
        } else {
            data = file.contents.toString('base64');
            encoding = 'base64';
        }
        imageInfo.data = 'url(data:' + mimetype + ';' + encoding + ',' + data + ')';
        images.push(imageInfo);

    };

    var endStream = function () {
        this.emit('data', new gutil.File({
            contents: new Buffer(mustache.render(template, {
                prefix: options.prefix,
                path_prefix: pathPrefix(),
                items: images
            }), 'utf8'),
            path: options.targetFile
        }));
        this.emit('end');
    };

    return new through(bufferContents, endStream);
};
