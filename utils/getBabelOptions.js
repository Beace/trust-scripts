const options = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: false,
        useBuiltIns: 'entry',
        targets: {
          browsers: [
            'last 2 versions',
            'Firefox ESR',
            '> 1%',
            'ie >= 9',
            'iOS >= 8',
            'Android >= 4',
          ],
        },
      },
    ],
    require.resolve('@babel/preset-react'),
  ],
}

module.exports = options;
