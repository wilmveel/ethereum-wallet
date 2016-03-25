var express = require('express');

var app = express();

var proxyMiddleware = require('http-proxy-middleware');
var proxy = proxyMiddleware('/web3', {
    target: 'http://128.199.53.68:8545/'
});
app.use(proxy);

app.use(express.static('assets'));

var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var config = require('./webpack.config');
app.use(webpackMiddleware(webpack(config),{
    contentBase: __dirname + "/assets",
    hot: true,
}));



app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});