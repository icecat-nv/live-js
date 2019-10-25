let webpack = require('webpack');

const methodNamesNotToMagle = ['getDatasheet', 'getVideos', 'get3DTours', 'getRTB']

module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                except: [...methodNamesNotToMagle],
                keep_fnames: true
            },
            comments: false,
            sourceMap: true,
            compress: {
                warnings: false,
                drop_console: false,
                unsafe: true
            } 
        })
    ]
}