var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through');
var mustache = require('mustache');
var sizeOf = require('image-size');
var mime = require('mime');
var md5 = require('MD5');

module.exports = function (options) {
    var buffer = [];

    if (!options) options = {};

    if(!options.template)
        options.template = path.join(__dirname, 'compass-imagehelper.mustache');

    if(!options.targetFile)
        options.targetFile = '_compass-imagehelper.scss';

    if(!options.prefix)
        options.prefix = '';

    var template = fs.readFileSync(options.template).toString();


    var bufferContents = function (file) {
        //if (file.isNull()) {
        //    this.push(file);
        //    return callback();
        //} else if (file.isStream()) {
        //    this.emit("error", new gutil.PluginError("gulp-compass-imagehelper", "Stream content is not supported"));
        //    return callback();
        //}

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
        imageInfo.path = path.relative(file.base, file.path);
        imageInfo.fullname = imageInfo.path.split(path.sep).join('-');
        imageInfo.hash = md5(file.contents);
        if (mimetype == 'image/svg+xml') {
            data = encodeURIComponent(file.contents);
            encoding = 'utf8';
        } else {
            data = file.contents.toString('base64');
            encoding = 'base64';
        }
        imageInfo.data = 'url(data:' + mimetype + ';' + encoding + ',' + data + ')';
        buffer.push(imageInfo);

    };

    var endStream = function () {
        this.emit('data', new gutil.File({
            contents: new Buffer(mustache.render(template, {
                prefix: options.prefix,
                items: buffer
            }), 'utf8'),
            path: options.targetFile
        }));
        this.emit('end');
    };

    return new through(bufferContents, endStream);
};
