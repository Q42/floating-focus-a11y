/* global __dirname */
const path = require('path');

module.exports = {
	testEnvironment: 'jsdom',
	clearMocks: true,
	moduleFileExtensions: ["js", "jsx", "json"],
	setupFilesAfterEnv: ['<rootDir>/__mocks__/generalMocks'],
	transform: {
		// Stub all styling & assets
		".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
			"jest-transform-stub",
		"^.+\\.jsx?$": "babel-jest"
	},
	transformIgnorePatterns: ["/node_modules/"],
	testEnvironmentOptions:{
		url: "http://localhost/"
	}
};
