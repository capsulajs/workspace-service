module.exports = {
  preset: 'ts-jest',
  transform: {
    '\\.ts$': 'ts-jest',
  },
  testRegex: '.*\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['src', 'node_modules'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./tests/setup.ts'],
  globals: {},
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.ts',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};
