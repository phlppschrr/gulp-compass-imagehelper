var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
var through = require('through');
var gutil = require('gulp-util');
var mime = require('mime');
var sizeOf = require('image-size');
var md5 = require('MD5');

module.exports = function (options) {
    var buffer = [];
    if(!options.template){
        options.template = path.join(__dirname, 'compass-imagehelper.mustache');
    }
    if(!options.targetFile){
        options.targetFile = '_compass-imagehelper.scss';
    }
    var tpl = fs.readFileSync(options.template).toString();


    var bufferContents = function (file) {

        var imgData = {};
        var data;
        var encoding;

        var mimetype = mime.lookup(file.path);
        var dimensions = sizeOf(file.path);

        imgData.width = dimensions.width;
        imgData.height = dimensions.height;
        imgData.type = dimensions.type;
        imgData.basename = path.basename(file.path, '.' + dimensions.type);
        imgData.path= path.relative(file.base, file.path);
        imgData.fullname = imgData.relpath.replace('/', '-');
        imgData.mime = mimetype;
        imgData.hash = md5(file.contents);
        if (mimetype == 'image/svg+xml') {
            data = encodeURIComponent(file.contents);
            encoding = 'utf8';
        } else {
            data = file.contents.toString('base64');
            encoding = 'base64';
        }
        imgData.data = 'url(data:' + mimetype + ';' + encoding + ',' + data + ')';
        buffer.push(imgData);

    };

    var endStream = function () {
        this.emit('data', new gutil.File({
            contents: new Buffer(mustache.render(tpl, {
                items: buffer
            }), 'utf8'),
            path: options.targetFile
        }));
        this.emit('end');
    };

    return new through(bufferContents, endStream);
};
