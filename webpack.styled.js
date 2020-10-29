/* global __dirname */
'use strict';
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist/styled'),
	},
	module: {
		rules: [
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
});
