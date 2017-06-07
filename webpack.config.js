const path = require('path');
const webpack = require("webpack");
const isProduction = (process.env.NODE_ENV === 'production');

module.exports = {

	devtool: 'inline-source-map',
	entry: [
	'react-hot-loader/patch',
	// activate HMR for React

	'webpack-dev-server/client?http://localhost:3000',
	// bundle the client for webpack-dev-server
	// and connect to the provided endpoint

	'webpack/hot/only-dev-server',
	// bundle the client for hot reloading
	// only- means to only hot reload for successful updates

	"./src/index.js"
	],
	plugins: [
	new webpack.HotModuleReplacementPlugin() // Enable HMR
	],
	output: {
		path: path.resolve(__dirname, 'dist/assets'),    
		filename: "bundle.js",
		publicPath: "assets"
	},
	devServer: {
		hot:true,
		contentBase: path.resolve(__dirname, 'dist'),    
		port: 3000
	},
	module: {
		rules: [
		{
			test: /.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		},
		{
			test: /\.css$/,
			loader: 'style-loader!css-loader!autoprefixer-loader'
		},
		{
			test: /\.scss$/,
			use: [
			 {loader: 'style-loader'},
			 {loader: 'css-loader'},
			 {loader: 'autoprefixer-loader'},
			 {loader: 'sass-loader'}
			]
		}
		]
	}
}







