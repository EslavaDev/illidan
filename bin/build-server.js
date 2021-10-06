const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const nodemon = require('nodemon');
const { getLogPrefix } = require('../helpers/log');

const execPromise = promisify(exec);

const babelConfigPath = require.resolve('../config/babel/babel.conf.server');

async function buildServerLib() {
  const buildFolder = 'lib';
  await execPromise(
    `${
      /^win/.test(process.platform) ? 'npx.cmd' : 'npx'
    } rimraf ${buildFolder}`,
  );
  const babelArgs = [
    'babel',
    '--config-file',
    babelConfigPath,
    '--extensions',
    '.js,.ts,.tsx',
    './src',
    '--out-dir',
    './lib',
    '--ignore',
    '**/*.test.*,**/*.spec.*,**/client/**,**/*.d.ts',
    '--source-maps',
  ];
  spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', babelArgs, {
    env: {
      IS_BROWSER: false,
      PATH: process.env.PATH,
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'development',
    },
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

function runServerDev({ entry, watch }) {
  const logPrefixInfo = getLogPrefix('info');
  console.log(`${logPrefixInfo} Dev server started`);
  const babelRuntime = require.resolve('../config/babel/babel.server');
  const babelNodeArgs = ['babel-node', '-r', babelRuntime];
  const spawnConfig = {
    env: {
      PATH: process.env.PATH,
      IS_BROWSER: false,
      ...process.env,
      NODE_ENV: 'development',
    },
    cwd: process.cwd(),
    stdio: 'inherit',
  };
  if (watch) {
    const nodemonConfig = {
      watch: 'src/**/*',
      ext: 'js,jsx,ts,tsx,json',
      ignore: 'src/**/*.spec.ts,src/**/*.test.ts',
      execMap: {
        ts: babelNodeArgs.join(' '),
        js: babelNodeArgs.join(' '),
      },
      script: entry,
    };
    nodemon.on('boot', () => {
      console.log(`${logPrefixInfo} Watching file changes`);
      console.log(
        `${logPrefixInfo} You can type 'rs' in the terminal to restart the service manually`,
      );
    });
    nodemon(nodemonConfig);
    nodemon.on('restart', () => {
      console.log(`${logPrefixInfo} Restarting dev server due to file changes`);
    });
    nodemon.on('crash', () => {
      console.log(`${getLogPrefix('error')} Script crashed for some reason`);
    });

    nodemon.on('error', (err) => {
      console.log('An error occurred');
      console.log(err);
    });
    return;
  }
  spawn(
    /^win/.test(process.platform) ? 'npx.cmd' : 'npx',
    [...babelNodeArgs, entry],
    spawnConfig,
  );
}
module.exports = { buildServerLib, runServerDev };
