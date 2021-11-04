#!/usr/bin/env node
const yargs = require('yargs');
const createPageScript = require('./create-page');
const { buildWebpackClient, serveWebpackDev } = require('./build-client');
const { buildServerLib, runServerDev } = require('./build-server');
const { runTests } = require('./run-test');

const AVAILABLE_COMMANDS = {
  CLIENT_BUILD: 'client-build',
  CLIENT_SERVE: 'client-serve',
  SERVER_BUILD: 'server-build',
  TESTS: 'test',
  SERVER_DEV: 'server-dev <entry>',
  CREATE_PAGE: 'create-page',
};

yargs(process.argv.slice(2))
  .usage('Usage: $0 <command> [options]')
  .command(
    AVAILABLE_COMMANDS.TESTS,
    'Run unit test',
    (command) =>
      command
        .option('e', {
          alias: 'env',
          demandOption: false,
          describe: 'Environment for test runner',
          type: 'string',
          choices: ['server', 'client', 'universal'],
        })
        .option('c', {
          alias: 'coverage',
          demandOption: false,
          describe: 'Collect coverage',
          type: 'boolean',
        })
        .option('s', {
          alias: 'silent',
          demandOption: false,
          describe: 'Prevent tests from printing messages through the console',
          type: 'boolean',
        })
        .option('w', {
          alias: 'watch',
          demandOption: false,
          describe:
            'Watch files for changes and rerun tests related to changed files. If you want to re-run all tests when a file has changed, use the `--watchAll` option.',
          type: 'boolean',
        }),
    runTests,
  )
  .command(
    AVAILABLE_COMMANDS.CLIENT_BUILD,
    'Build client assets',
    (command) =>
      command
        .option('w', {
          alias: 'watch',
          default: false,
          demandOption: false,
          describe: 'Watch file changes',
          type: 'boolean',
        })
        .option('m', {
          alias: 'mode',
          demandOption: true,
          describe: 'Compile mode',
          type: 'string',
          default: 'development',
          choices: ['development', 'production'],
        }),
    buildWebpackClient,
  )
  .command(
    AVAILABLE_COMMANDS.CLIENT_SERVE,
    'Start assets server',
    (command) =>
      command
        .option('m', {
          alias: 'mode',
          demandOption: true,
          describe: 'Compile mode',
          type: 'string',
          default: 'development',
          choices: ['development', 'production'],
        })
        .option('p', {
          alias: 'port',
          demandOption: false,
          describe: 'Port',
          type: 'number',
          default: 9090,
        }),
    serveWebpackDev,
  )
  .command(
    AVAILABLE_COMMANDS.SERVER_DEV,
    'Run development server',
    (command) =>
      command
        .option('w', {
          alias: 'watch',
          demandOption: false,
          describe: 'Watch file changes',
          type: 'boolean',
        })
        .positional('entry', {
          demandOption: true,
          describe: 'Entrypoint',
          type: 'string',
        }),
    runServerDev,
  )
  .command(
    AVAILABLE_COMMANDS.SERVER_BUILD,
    'Transpile server files for production',
    {},
    buildServerLib,
  )
  .command(
    AVAILABLE_COMMANDS.CREATE_PAGE,
    'Create page boilerplate',
    (command) =>
      command.option('p', {
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
  .check((checkArgv) => {
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
