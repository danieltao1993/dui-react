const path = require('path'); // 导入路径包
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin') //webpack插件，用于清除目录文件

module.exports = {
    entry: "./index.jsx",
    output: {
        path: path.resolve(__dirname, 'build'), // 指定打包之后的文件夹
        // publicPath: '/assets/', //指定资源文件引用的目录
        // filename: 'bundle.js' // 指定打包为一个文件 bundle.js
        filename: '[name].js' // 可以打包为多个文件
    },
    // devtool: 'eval-source-map',
    module: {
        /* 在webpack2.0版本已经将 module.loaders 改为 module.rules 为了兼容性考虑以前的声明方法任然可用，同时链式loader(用!连接)只适用于module.loader
        同时-loader不可省略 */
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        // modules: true // 设置css模块化,详情参考https://github.com/css-modules/css-modules
                    }
                }, {
                    loader: 'postcss-loader',
                    // 在这里进行配置，也可以在postcss.config.js中进行配置，详情参考https://github.com/postcss/postcss-loader
                    options: {
                        plugins: function () {
                            return [
                                require('postcss-import')(),
                                require('precss')(),
                                require('autoprefixer')(),
                            ];
                        }
                    }
                }]
            })
        }, {
            test: /\.styl(us)?$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', {
                    loader: "postcss-loader",
                }, 'stylus-loader']
            })
        }, {
            test: /\.js[x]?$/,
            loader: 'babel-loader?presets[]=es2015&presets[]=react', //此处不能用use，不知道为啥
            exclude: /node_modules/ //需要排除的目录
        }]
    },

    // 配置devServer各种参数
    devServer: {
        contentBase: "./", // 本地服务器所加载的页面所在的目录
        hot: true, // 配置HMR之后可以选择开启
        historyApiFallback: true, // 不跳转
        inline: true // 实时刷新
    },
    // postcss: function plugins(bundler) {
    //     return [
    //         require('postcss-import')({
    //             addDependencyTo: bundler
    //         }),
    //         require('precss')(),
    //         require('autoprefixer')({
    //             browsers: AUTOPREFIXER_BROWSERS
    //         }),
    //     ];
    // },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html' // 模版文件
        }),
        new CleanPlugin(['build']),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors' // 将公共模块提取，生成名为`vendors`的chunk
        }),
        // new webpack.optimize.UglifyJsPlugin({ //压缩js代码
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new ExtractTextPlugin('[name].css')
    ]
};