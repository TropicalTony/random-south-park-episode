module.exports = function (conf) {
    conf.set({
        frameworks: ['jasmine'],
        files: [
            { pattern: 'test/test-context.js', watched: false }
        ],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-webpack'
        ],
        reporters: ['progress'],
        browsers: ['PhantomJS'],
        singleRun: true,

        preprocessors: {
           'test/test-context.js': ['webpack']
        },
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.js/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015']
                        }
                    }
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};
