
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/app/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            // eventuali altri loader (CSS, immagini, ecc.)
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        // todo: is correct in live?
        proxy: {
            '/api': {
                target: 'https://dacosta-vm.nubilaria.corp/banda_larga_backend',
                changeOrigin: true,
                secure: false
            }
        },
        compress: true,
        port: 3000,
        open: true,
        historyApiFallback: true,
    },
    resolve: {
        extensions: ['.js'],
    },
};
