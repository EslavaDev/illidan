const path = require('path');

const rootDir = process.cwd();

const sharedConfig = {
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '(/__tests__/.*|(\\\\.|/)(test|spec))\\\\.[jt]sx?$',
  ],
  rootDir,
  resetMocks: true,
  transform: {
    '\\.(ts|js)x?$': [
      'babel-jest',
      { configFile: path.resolve(__dirname, '../babel/babel.conf.server.js') },
    ],
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      path.resolve(__dirname, '__mocks__/fileMock.js'),
    '\\.(css|scss)$': path.resolve(__dirname, '__mocks__/styleMock.js'),
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')],
};

const defaultEnv = process.env.ILLIDAN_TEST_ENV === 'server' ? 'node' : 'jsdom';

const projects =
  process.env.ILLIDAN_TEST_ENV === 'universal'
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
            '<rootDir>/**/__tests__/**/*.client.[jt]s?(x)',
            '<rootDir>/**/*.client.+(spec|test).[jt]s?(x)',
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

// illidan test --env=universal ## Will look for files .client.spec and .server.spec. Default env for ".spec only" files will be jsdom
// illidan test --env=client|null ## Will look for .spec files. Running on jsdom env
// illidan test --env=server ## Will look for .spec files. Running on node env
