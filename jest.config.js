module.exports = {
  preset: 'ts-jest',
  transform: {
    '\\.ts$': 'ts-jest',
  },
  testRegex: '.*\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['src', 'node_modules'],
  testEnvironment: 'node',
  globals: {
    window: {},
    document: {},
    HTMLElement: {}
  },
};
