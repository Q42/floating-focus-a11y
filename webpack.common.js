'use strict';

module.exports = {
	entry: {
		'floating-focus': './src/floating-focus.js',
	},
	output: {
		library: 'floating-focus',
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				enforce: 'pre'
			},
			{
				test: /\.js$/,
				exclude: /node_modules|dist/,
				loader: 'babel-loader'
			},
		]
	}
};
