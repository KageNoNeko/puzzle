const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = (env, argv) => {

    return {
        context: ROOT,

        entry: `./main.ts`,

        output: {
            filename: '[name].bundle.js',
            path: DESTINATION
        },

        resolve: {
            extensions: [ '.ts', '.js' ],
            modules: [
                ROOT,
                'node_modules'
            ]
        },

        module: {
            rules: [
                /****************
                 * PRE-LOADERS
                 *****************/
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    use: 'source-map-loader'
                },
                {
                    enforce: 'pre',
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: 'tslint-loader'
                },

                /****************
                 * LOADERS
                 *****************/
                {
                    test: /\.ts$/,
                    exclude: [ /node_modules/ ],
                    use: 'awesome-typescript-loader'
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    exclude: [ /node_modules/ ],
                    use: 'file-loader'
                }
            ]
        },

        plugins: [new HtmlWebpackPlugin()],

        devtool: 'cheap-module-source-map'
    };
};