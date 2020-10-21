/* global __dirname */
'use strict';
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
		]
	},
	plugins: [
		new MiniCssExtractPlugin()
	]
};
