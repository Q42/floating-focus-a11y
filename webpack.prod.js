'use strict';
const merge = require('webpack-merge');
const styled = require('./webpack.styled.js');
const unstyled = require('./webpack.unstyled.js');

module.exports = [
	merge(styled, {
		mode: 'production'
	}),
	merge(unstyled, {
		mode: 'production'
	}),
];
