module.exports = api => {
	const isTest = api.env("test");
	// Cache the returned result
	api.cache(true);

	return {
		presets: [
			[
				"@babel/preset-env",
				{
					modules: isTest ? "commonjs" : false,
					loose: true,
					useBuiltIns: "usage",
					corejs: 3,
					exclude: [
						"es.regexp.to-string" // not used for RegExp
					]
				}
			]
		]
	}
};
