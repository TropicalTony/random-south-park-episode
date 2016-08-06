const path = require('path');

module.exports = {
    cache: true,
    devtool: 'inline-source-map',

    entry: {
        app: path.join(__dirname, 'src', 'main.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    resolve: {
        root: [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'node_modules')
        ],
        extensions: ['', '.js']
    }
};
