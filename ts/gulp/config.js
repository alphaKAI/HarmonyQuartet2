var dest = '../../';
var src = '../';
var path = require('path');
var relativeSrcPath = path.relative('.', src);

module.exports = {
    minify: {
        src: dest + '/js/*.js',
        dest: dest + '/js/min',
    },

    tsd: {
       json: src + '/tsd.json'
    },

    ts: {
        src: [
            src + '*.ts'
        ],
        dest: dest + '/js',
        options: {
            noImplicitAny : true,
            target : 'ES5',
            module : 'commonjs'
        }
    },

    browserify: {
        entry: {
            entries: dest + '/js/main.js',
            debug: true
        },
        dest: dest + '/js',
        output: {
            filename: 'bundle.js'
        }
    },

    watch: {
        ts: relativeSrcPath + '/ts/*.ts',
        js: relativeSrcPath + '/js/*.js'
    }
}
