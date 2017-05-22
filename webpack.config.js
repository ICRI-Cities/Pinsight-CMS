var webpack = require("webpack");
var isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
	debug: !isProduction,
	devtool: 'inline-source-map',
	entry: "./src/index.js",
	plugins: [
	new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('production')
		}
	})
	],
	output: {
		path: "dist/assets",
		filename: "bundle.js",
		publicPath: "assets"
	},
	devServer: {
		inline: true,
		contentBase: './dist',
		port: 3000
	},
	module: {
		loaders: [
		{
			test: /\.js$/,
			exclude: /(node_modules)/,
			loader: ["babel-loader"],
			query: {
				presets: ["latest", "stage-0", "react"]
			}
		},
		{
			test: /\.json$/,
			exclude: /(node_modules)/,
			loader: "json-loader"
		},
		{
			test: /\.css$/,
			loader: 'style-loader!css-loader!autoprefixer-loader'
		},
		{
			test: /\.scss$/,
			loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
		}
		]
	}
}







