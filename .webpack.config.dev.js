const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const path = require('path');

const packageJson = require('./package.json');

module.exports = {
    context: path.resolve(__dirname),

    watch: true,
    devtool: 'inline-cheap-module-source-map',

    entry: {
        background: './src/background/index.js',
        content: './src/content/index.js'
    },
    output: {
        filename: './dist/js/[name].js'
    },
    module: {
        rules: [
            {
                test: /src\/.*\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    plugins: [
        new WriteFilePlugin(),
        new CopyWebpackPlugin([
            { from: 'assets/*', to: 'dist/' },
            {
                from: 'manifest.template.json',
                to: 'dist/manifest.json',
                transform: (content, path) =>
                    JSON.stringify(Object.assign(
                        {},
                        JSON.parse(content),
                        { version: packageJson.version }
                    ), false, 2)
            }
        ])
    ]
};
