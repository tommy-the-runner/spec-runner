'use strict'

const Suite = require('mocha/lib/suite')
const Runner = require('mocha/lib/runner')
const Context = require('mocha/lib/context')
const bddInterface = require('mocha/lib/interfaces/bdd')
const specTemplate = require('./spec_template')
const RoughReporter = require('./rough_reporter')

const chai = require('chai')
const sinon = require('sinon')

function compile(code) {
    var fn = new Function('module', 'exports', code)

    var exports = {}
    var module = {
        exports
    }

    fn(module, module.exports)

    return module.exports
}

function run(code, specs) {
    const mocha = {
        options: {}
    }
    const ctx = new Context
    const suite = new Suite('JSON suite', ctx);
    const runner = new Runner(suite)
    const reporter = new RoughReporter(runner)

    bddInterface(suite)

    const specsCode = specTemplate.render(specs)

    return Promise.resolve([code, specsCode])
        .then(sources => {
            return sources.map(source => compile(source))
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
    run,
    compile
}
