const path = require('path');

module.exports = {
    entry: {
        background: './src/background/index.js',
        content: './src/content/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
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
    }
};
