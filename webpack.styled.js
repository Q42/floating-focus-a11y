'use strict';
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
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
