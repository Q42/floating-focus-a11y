/* global __dirname */
'use strict';
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
	output: {
		path: path.resolve(__dirname, 'dist/unstyled'),
	},
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			},
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'index.css'
		})
	]
});
