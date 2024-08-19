/** @type {import('jest').Config} */
const config = {
    coverageProvider: 'v8',
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js'],
    globalSetup: '<rootDir>/jest.global-setup.mjs',
};

export default config;
