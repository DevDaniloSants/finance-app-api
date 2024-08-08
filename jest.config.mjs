/** @type {import('jest').Config} */
const config = {
    coverageProvider: 'v8',
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js'],
};

export default config;
