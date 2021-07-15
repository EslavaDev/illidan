#!/usr/bin/env node
const yargs = require('yargs');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const createPageScript = require('./create-page');

const AVAILABLE_COMMANDS = {
  CLIENT_BUILD: 'client-build',
  CLIENT_DEV: 'client-dev',
  SERVER_BUILD: 'server-build',
  SERVER_DEV: 'server-dev',
  CREATE_PAGE: 'create-page',
};

const execPromise = promisify(exec);

const webpackConfigPath = require.resolve('../config/webpack/webpack.config');

function buildWebpack({ watch, mode }) {
  const webpackArgs = [
    'webpack',
    `--config=${webpackConfigPath}`,
    `--mode=${mode}`,
  ];
  webpackArgs.push(...(watch ? ['--watch'] : []));
  spawn('npx', webpackArgs, {
    env: {
      IS_BROWSER: true,
      PATH: process.env.PATH,
      ...process.env,
      NODE_ENV: mode,
    },
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

function buildWebpackDev({ watch }) {
  buildWebpack({ mode: 'development', watch });
}
async function buildWebpackClient() {
  await execPromise('npx rimraf public');
  buildWebpack({ mode: 'production' });
}

yargs(process.argv.slice(2))
  .usage('Usage: $0 <command> [options]')
  .command(
    AVAILABLE_COMMANDS.CLIENT_BUILD,
    'Build client assets for production',
    {},
    buildWebpackClient,
  )
  .command(
    AVAILABLE_COMMANDS.CLIENT_DEV,
    'Build client assets for development',
    (command) =>
      command.option('w', {
        alias: 'watch',
        demandOption: false,
        describe: 'Watch file changes',
        type: 'boolean',
      }),
    buildWebpackDev,
  )
  .command(
    AVAILABLE_COMMANDS.SERVER_DEV,
    'Transpile server files for development',
    (command) =>
      command.option('w', {
        alias: 'watch',
        demandOption: false,
        describe: 'Watch file changes',
        type: 'boolean',
      }),
  )
  .command(
    AVAILABLE_COMMANDS.SERVER_BUILD,
    'Transpile server files for production',
  )
  .command(
    AVAILABLE_COMMANDS.CREATE_PAGE,
    'Create page boilerplate',
    (yargs) =>
      yargs.option('p', {
        alias: 'page',
        demandOption: false,
        describe: 'Name of the page (Only for <create-page> command)',
        type: 'string',
      }),
    createPageScript,
  )
  .example(
    '$0 create-page -p settings',
    'Creates page boilerplate with "settings" name',
  )
  .example('$0 client-dev -w', 'Build client (dev) and watch file changes')
  .example('$0 server-dev -w', 'Transpile server (dev) and watch file changes')
  .help()
  .epilog(`Copyright ${new Date().getFullYear()}`)
  .check((checkArgv, options) => {
    const commands = checkArgv._;
    if (!commands.length) {
      throw Error('No commands provided');
    }
    if (commands.length > 1) {
      throw Error('Only one command is allowed at a time');
    }
    return true;
  })
  .strict(true)
  .version(false)
  .parse();
