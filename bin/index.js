#!/usr/bin/env node
const yargs = require('yargs');
const createPageScript = require('./create-page');
const { buildWebpackClient, buildWebpackDev } = require('./build-client');
const { buildServerLib, runServerDev } = require('./build-server');
const { runTests } = require('./run-test');

const AVAILABLE_COMMANDS = {
  CLIENT_BUILD: 'client-build',
  CLIENT_DEV: 'client-dev',
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
      command.option('e', {
        alias: 'env',
        demandOption: false,
        describe: 'Environment for test runner',
        type: 'string',
        choices: ['server', 'client', 'universal'],
      }),
    runTests,
  )
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
