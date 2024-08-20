/** @type {import('jest').Config} */
const config = {
    coverageProvider: 'v8',
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js'],
    globalSetup: '<rootDir>/jest.global-setup.js',
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
};

export default config;
