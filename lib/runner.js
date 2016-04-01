'use strict'

const Mocha = require('mocha')
const sinon = require('sinon')
const Suite = Mocha.Suite
const Runner = Mocha.Runner
const Context = Mocha.Context
const SilentJsonReporter = require('./silent_json_reporter')
const specTemplate = require('./spec_template')

const requireFromString = require('require-from-string')

function run(code, specs) {
    var mocha = new Mocha({
        reporter: SilentJsonReporter
    })

    const ctx = new Context
    const suite = new Suite('JSON suite', ctx);
    const runner = new Runner(suite)
    const reporter = new mocha._reporter(runner)

    Mocha.interfaces.bdd(suite)

    const specsCode = specTemplate.render(specs)

    return Promise.resolve([code, specsCode])
        .then(sources => {
            return sources.map(source => requireFromString(source))
        })
        .then(modules => {
            let codeModule = modules[0]
            let specModule = modules[1]

            const mockedRequire = function (name) {
                if (name === 'subject') {
                    return codeModule
                }

                return require.apply(this, arguments)
            }

            suite.emit('pre-require', ctx, 'spec.js', mocha)
            suite.emit('require', specModule(ctx, mockedRequire), 'spec.js', mocha)
            suite.emit('post-require', ctx, 'spec.js', mocha)
        })
        .then(() => {
            return new Promise((resolve) => {
                runner.run(() => resolve(reporter))
            })
        })
}

module.exports = {
    run
}
