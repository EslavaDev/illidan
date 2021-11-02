const path = require('path');

const rootDir = process.cwd();

const sharedConfig = {
  rootDir,
  resetMocks: true,
  transform: {
    '\\.(ts|js)x?$': [
      'babel-jest',
      { configFile: path.resolve(__dirname, '../babel/babel.conf.server.js') },
    ],
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')],
};

const defaultEnv = process.env.CRONOS_TEST_ENV === 'server' ? 'node' : 'jsdom';

const projects =
  process.env.CRONOS_TEST_ENV === 'universal'
    ? [
        {
          displayName: 'SERVER',
          testEnvironment: 'node',
          testMatch: [
            '<rootDir>/**/__tests__/**/*.server.[jt]s?(x)',
            '<rootDir>/**/*.server.+(spec|test).[jt]s?(x)',
          ],
          ...sharedConfig,
        },
        {
          displayName: 'CLIENT',
          rootDir,
          testEnvironment: 'jsdom',
          testMatch: [
            '<rootDir>/**/__tests__/**/*?(.client).[jt]s?(x)',
            '<rootDir>/**/*?(.client).+(spec|test).[jt]s?(x)',
          ],
          ...sharedConfig,
        },
      ]
    : null;

module.exports = {
  ...sharedConfig,
  projects,
  testEnvironment: defaultEnv,
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
// file.server.spec.js

// file.client.spec.js

// cronos test --env=universal ## Will look for files .client.spec and .server.spec. Default env for ".spec only" files will be jsdom
// cronos test --env=client|null ## Will look for .spec files. Running on jsdom env
// cronos test --env=server ## Will look for .spec files. Running on node env
