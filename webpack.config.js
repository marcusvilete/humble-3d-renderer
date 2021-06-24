const path = require('path');

module.exports = {

    // bundling mode
    mode: 'production',
    devtool: 'source-map', // generate source map

    // entry files
    entry: './src/main.ts',

    // output bundles (location)
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },

    // file resolutions
    resolve: {
        extensions: ['.ts', '.js'],
    },

    // loaders
    module: {
        rules: [{
            test: /\.tsx?/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }]
    }
};