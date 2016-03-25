module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname + '/dist',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: /\.json$/, loader: 'json'},
            {test: /\.css$/, loader: "style!css"},
            {test: /\.html$/, loader: 'file?name=[name].[ext]'}
        ]
    }
};