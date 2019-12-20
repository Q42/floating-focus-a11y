/* global __dirname */
'use strict';
const path = require('path');

module.exports = {
	entry: {
		'floating-focus': './src/floating-focus.js',
	},
	output: {
		library: 'floating-focus',
		libraryTarget: 'umd',
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
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
			{
				test: /\.(css|scss)$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			},
		]
	}
};
