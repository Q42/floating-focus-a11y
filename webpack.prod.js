'use strict';
const merge = require('webpack-merge');
const styled = require('./webpack.styled.js');
const unstyled = require('./webpack.unstyled.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const prodConfig = {
	mode: 'production',
	plugins: [
		new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!unstyled.js', '!floating-focus.js', '!floating-focus.css'] })
	]
};

module.exports = [
	merge(styled, prodConfig),
	merge(unstyled, prodConfig),
];
