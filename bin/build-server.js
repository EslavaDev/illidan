const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const { getLogPrefix } = require('../helpers/log');

const execPromise = promisify(exec);

const babelConfigPath = require.resolve('../config/babel/babel.conf');

async function buildServerLib() {
  const buildFolder = 'lib';
  await execPromise(`npx rimraf ${buildFolder}`);
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
  ];
  spawn('npx', babelArgs, {
    env: {
      IS_BROWSER: true,
      PATH: process.env.PATH,
      ...process.env,
      NODE_ENV: 'production',
    },
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

function runServerDev({ entry, watch }) {
  const logPrefixInfo = getLogPrefix('info');
  console.log(`${logPrefixInfo} Dev server started`);
  const babelRuntime = require.resolve('../config/babel/babel.server');
  const babelNodeArgs = ['babel-node', '-r', babelRuntime, entry];
  const spawnConfig = {
    env: {
      PATH: process.env.PATH,
      ...process.env,
      NODE_ENV: 'development',
    },
    cwd: process.cwd(),
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  };
  if (watch) {
    const nodemonArgs = [
      'nodemon',
      '--quiet',
      '-e',
      'ts,tsx,json',
      '-i',
      'src/**/*.spec.ts,src/**/*.test.ts',
      '-w',
      'src/**/*',
      '-x',
      `npx ${babelNodeArgs.join(' ')}`,
    ];
    const nodemon = spawn('npx', nodemonArgs, spawnConfig);
    nodemon.on('message', (event) => {
      if (event.type === 'boot') {
        console.log(`${logPrefixInfo} Watching file changes`);
        console.log(
          `${logPrefixInfo} You can type 'rs' in the terminal to restart the service manually`,
        );
      } else if (event.type === 'restart') {
        console.log(
          `${logPrefixInfo} Restarting dev server due to file changes...`,
        );
      } else if (event.type === 'crash') {
        console.log(`${getLogPrefix('error')} Script crashed for some reason`);
      }
    });

    nodemon.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
    });

    nodemon.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    return;
  }
  spawn('npx', babelNodeArgs, spawnConfig);
}
module.exports = { buildServerLib, runServerDev };
