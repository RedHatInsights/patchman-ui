require.extensions['.css'] = () => undefined;
const path = require('path');
const glob = require('glob');

/**
 * We require a mapper for some PF modules because the modle export names do not match their location
 */
const mapper = {
    TextVariants: 'Text',
    EmptyStateVariant: 'EmptyState'
};

/**
 * These two plugins will replace all replative imports with absolute import paths to the commonJS version of asset
 * PF esm build is broken, it points to commonJS files internaly
 * There fore its better to use commonJS version of the build to avoid duplicate cjs/esm variants of components
 * After its fixed in PF we can swap to using esm build
 */
const patternflyTransformImports = [
    'transform-imports',
    {
        '@patternfly/react-table': {
            skipDefaultConversion: true,
            transform: '@patternfly/react-core/dist/js'
        },
        '@patternfly/react-core': {
            transform: (importName) => {
                let res;
                const files = glob.sync(
                    path.resolve(
                        __dirname,
                        `./node_modules/@patternfly/react-core/dist/js/**/${mapper[
                        importName
                        ] || importName}.js`
                    )
                );
                if (files.length > 0) {
                    res = files[0];
                } else {
                    throw `File with importName ${importName} does not exist`;
                }

                res = res.replace(path.resolve(__dirname, './node_modules/'), '');
                res = res.replace(/^\//, '');
                return res;
            },
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@patternfly/react-icons': {
            transform: (importName) =>
                `@patternfly/react-icons/dist/js/icons/${importName
                .split(/(?=[A-Z])/)
                .join('-')
                .toLowerCase()}`,
            preventFullImport: true
        }
    },
    'patternfly-react'
];

module.exports = {
    presets: ['@babel/env', '@babel/react', '@babel/flow'],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        'lodash',
        '@babel/plugin-proposal-class-properties',
        patternflyTransformImports
    ]
};
