require('@babel/register')({
  extensions: ['.ts', '.tsx', '.js'],
  ignore: ['node_modules'],
  ...require('./babel.conf.server'),
});
