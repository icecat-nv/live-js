let webpack = require('webpack'),
    path = require('path'),
    config = require('./dev-server-config.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "DEV_SERVER_PORT": JSON.stringify(config.port),
            "DEV_SERVER_HOST": JSON.stringify(config.host)
        }),
       // new BundleAnalyzerPlugin()
    ],
    devtool: 'eval',
    devServer: {
        contentBase: path.join(__dirname, "../../public"),
        port: config.port,
        host: config.host,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }
}