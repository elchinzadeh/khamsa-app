module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
    },
    'extends': [
        'plugin:vue/essential',
        'google',
    ],
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'plugins': ['vue'],
    'rules': {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/html-indent': [
            'error',
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: [],
            },
        ],
        'vue/html-closing-bracket-newline': [
            'error',
            {
                'singleline': 'never',
                'multiline': 'always',
            },
        ],
        'vue/max-attributes-per-line': [
            'error',
            {
                'singleline': 1,
                'multiline': {
                    'max': 1,
                    'allowFirstLine': false,
                },
            },
        ],
        'vue/multiline-html-element-content-newline': [
            'error',
            {
                'ignoreWhenEmpty': true,
                'ignores': [
                    'pre',
                    'textarea',
                ],
                'allowEmptyLines': false,
            },
        ],
        'comma-spacing': [
            'error',
            {
                'after': true,
                'before': false,
            },
        ],
        'indent': [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        'no-multi-spaces': [
            'error',
            { 'ignoreEOLComments': true },
        ],
        'no-multiple-empty-lines': [
            'error',
            {
                'max': 2,
                'maxEOF': 0,
            },
        ],
        'quotes': [
            'error',
            'single',
        ],
        'semi': [
            'error',
            'always',
        ],
        'array-element-newline': [
            'error',
            'always',
        ],
        'array-bracket-newline': [
            'error',
            {
                'multiline': true,
                'minItems': 2,
            },
        ],
        'key-spacing': [
            'error',
            {
                'beforeColon': false,
                'afterColon': true,
            },
        ],
        'object-property-newline': [
            'error',
            { 'allowAllPropertiesOnSameLine': false },
        ],
        'object-curly-newline': [
            'error',
            { 'multiline': true },
        ],
        'object-curly-spacing': [
            'error',
            'always',
        ],
        'max-len': [
            'error',
            { 'code': 120 },
        ],
        'require-jsdoc': [
            'error',
            {
                'require': {
                    'FunctionDeclaration': false,
                    'MethodDefinition': false,
                    'ClassDeclaration': false,
                    'ArrowFunctionExpression': false,
                    'FunctionExpression': false,
                },
            },
        ],
    },
};
