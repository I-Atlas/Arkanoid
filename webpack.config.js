const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "production",
    devtool: "source-map",
    entry: "./src/new.js",
    output: {
        path: path.join(__dirname, "build")
    },
    module: {
        rules: [
            {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                presets: ['@babel/preset-env',
                            {
                                "plugins": ["@babel/plugin-proposal-class-properties"]
                            }
                        ]
                    }
                }
            }
        ]
    },
    devServer: {
        contentBase: "./build"
    },
    plugins: [
        new HtmlWebpackPlugin({template: './index.html'})
    ]
}