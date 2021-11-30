require('@babel/register')({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  ignore: ['node_modules'],
  ...require('./babel.conf.server'),
});
