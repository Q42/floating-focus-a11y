const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
	entry: {
		'floating-focus': './src/floating-focus.js',
	},
	output: {
		filename: 'index.js',
		library: 'floating-focus',
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules|dist/,
				loader: 'babel-loader',
			},
		],
	},
	plugins: [
		new ESLintPlugin({
			files: 'src/**/*.js',
			failOnWarning: true,
		}),
	],
}
