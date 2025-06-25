module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    // Mock CSS imports so Jest doesn't try to parse them as JS
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
};