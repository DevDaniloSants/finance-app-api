import jest from 'eslint-plugin-jest';

export default [
    {
        files: ['test/**'],
        ...jest.configs['flat/recommended'],
        rules: {
            ...jest.configs['flat/recommended'].rules,
            'jest/prefer-expect-assertions': 'off',
        },
    },
    {
        files: ['test/**'],
        rules: { 'jest/prefer-expect-assertions': 'off' },
    },
];
