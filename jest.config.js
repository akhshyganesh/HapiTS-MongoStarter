module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  },
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts'
  ],
  coverageReporters: ['text', 'lcov'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['./tests/setup.ts']
};
