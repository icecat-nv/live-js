let webpack = require('webpack'),
    merge = require('webpack-merge'),
    path = require('path'),
    os = require('os');

const HOST = os.hostname(),
    IS_PROD = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod',
    PROD_CONFIG = require('./config/webpack/prod'),
    DEV_CONFIG = require('./config/webpack/dev'),
    IS_DEV_SERVER = process.argv[1].indexOf('webpack-dev-server') !== -1;

const BASE_CONFIG = {
    context: __dirname + "/frontend/",
    entry: {
        'live-current-2': './entry'
    },

    output: {
        path: path.resolve(__dirname + '/public'),
        filename: 'js/[name].js',
        jsonpFunction: 'wpJsonpFlightsWidgetIcecatLive'
    },
    resolve: {
        modules: ['./', './modules', 'node_modules', 'bower_components'],
        alias: {
            'spritespin': 'lib/jqPlugins/spritespin',
            'hammer': 'hammerjs',
            'babel-polyfill': 'babel-polyfill/dist/polyfill',
            'handlebars': 'handlebars/dist/handlebars'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process": {
                "argv": JSON.stringify(process.argv),
                "env": JSON.stringify({
                    "NODE_ENV": process.env.NODE_ENV,
                    "HOST": HOST
                })
            },
            "os": {
                "hostname": JSON.stringify(HOST)
            },
            "IS_DEV_SERVER": IS_DEV_SERVER ? 1 : 0
        }),
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            async: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                include: [
                    path.resolve(__dirname + '/')
                ],
                // exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: [['es2015', { modules: false }]],
                    plugins: [
                        'transform-object-rest-spread',
                        'syntax-dynamic-import',
                        'transform-exponentiation-operator'
                    ],
                    babelrc: false,
                    cacheDirectory: true
                }
            },
            {
                // shim for jquery
                test: /jquery$/,
                loader: 'expose-loader?jQuery!expose-loader?$!exports-loader?$'
            },
            {
                test: /slick$/,
                loader: 'imports-loader?$=jquery!exports-loader?$.fn.slick'
            },
            {
                test: /jwplayer/,
                loader: 'script-loader'
            },
            {
                test: /babel-polyfill/,
                loader: 'script-loader'
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader",
                    options: { sourceMap: true, convertToAbsoluteUrls: true, },
        
                }, {
                    loader: "css-loader",
                    options: {
                        sourceMap: true,
                        importLoaders: 2,
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /.(tpl|txt)$/,
                use: [{
                    loader: 'raw-loader'
                }]
            },
            {
                // for converting from file to base64
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                loader: 'url-loader'
            },
        ]
    }
}

const ENV_SPECIFIC_CONFIG = IS_PROD ? PROD_CONFIG : DEV_CONFIG;

module.exports = merge(BASE_CONFIG, ENV_SPECIFIC_CONFIG)