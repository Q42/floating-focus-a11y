module.exports = (api) => {
  const isTest = api.env('test')
  // Cache the returned result
  api.cache(true)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: isTest ? 'commonjs' : false,
          loose: true,
          corejs: 3,
          useBuiltIns: 'entry',
          exclude: ['es.regexp.to-string'],
        },
      ],
    ],
  }
}
