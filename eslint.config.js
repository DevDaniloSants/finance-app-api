import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    pluginJs.configs.recommended,
    {
        files: ['tests/**'],
        languageOptions: { globals: { ...globals.node, ...globals.mocha } },
    },
];
