const merge = require('webpack-merge')
const styled = require('./webpack.styled.js')

module.exports = merge(styled, {
  mode: 'development',
  watch: true,
})
