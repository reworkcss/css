const ignores = ['/node_modules/', '__mocks__', '/dist/'];

/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.+(js|jsx|ts|tsx)',
    '!**/node_modules/**',
    '!**/*.d.ts',
  ],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores],
};
