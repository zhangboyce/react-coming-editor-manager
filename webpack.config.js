'use strict';

// config/webpack.config.js
var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, './node_modules');

var dir_src = path.resolve(__dirname, './app');
var dir_build = path.resolve(__dirname, './public/build');

module.exports = {
    entry: path.resolve(dir_src, 'main.jsx'),
    output: {
        path: dir_build, // for standalone building
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    // webpack-dev-server默认配置项，建议使用
    devServer: {
        contentBase: dir_build
    },
    module: {
        loaders: [
            {
                test: /app(\\|\/).+\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    plugins: ['transform-decorators-legacy' ],
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        ]
    },
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        colors: true // Nice colored output
    },
    node: {
        fs: "empty"
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map'
};