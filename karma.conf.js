require('dotenv').load()

module.exports = function(config) {
    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 10',
            version: '49'
        },
        sl_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 10',
            version: '45'
        }
    }

    config.set({
        sauceLabs: {
            testName: 'Tommy: Spec Runner Unit Tests'
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),

        browserDisconnectTimeout: 30000,
        browserNoActivityTimeout: 30000,

        frameworks: ['mocha', 'browserify'],
        reporters: ['dots', 'saucelabs'],

        preprocessors: {
            'spec/*.spec.js': [ 'browserify' ]
        },

        browserify: {
            debug: true,
            ignoreMissing: true,
            transform: [ 'brfs' ]
        },

        files: [
           'node_modules/**.js',
           'spec/*.spec.js'
        ]
    });
};
