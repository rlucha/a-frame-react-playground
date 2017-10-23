const BabiliPlugin = require('babili-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: "./app.js",
    output: {
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015", "react"],
                    plugins: []
                },
                include: [path.resolve(__dirname, "app")]
            }
        ]
    },
    // plugins: [new BabiliPlugin()],
    resolve: {
        modules: [path.join(process.cwd(), "app"), "node_modules"],
        extensions: [".js", ".json"]
    }
};
