'use strict'

const Mocha = require('mocha')
const sinon = require('sinon')
const Suite = Mocha.Suite
const Runner = Mocha.Runner
const Context = Mocha.Context
const interfaces = Mocha.interfaces

const requireFromString = require('require-from-string')

function noop() {}

function silentCall(fn, done) {
    sinon.stub(process.stdout, 'write', noop)

    const callback = function (err, data) {
        process.stdout.write.restore()
        done(err, data)
    }

    try {
        fn(callback)
    }
    catch (err) {
        process.stdout.write.restore()

        done(err)
    }
}

function silentCallAsPromise(fn) {
    return new Promise(function (resolve, reject) {
        silentCall(fn, function (err, data) {
            if (err) {
                reject(err)
                return
            }

            resolve(data)
        })
    })
}

function run(code, specs) {
    var mocha = new Mocha({
        reporter: 'json'
    })

    const ctx = new Context
    const suite = new Suite('JSON suite', ctx);
    const runner = new Runner(suite)
    const reporter = new mocha._reporter(runner)

    const bdd = interfaces.bdd

    bdd(suite)

    return Promise.resolve([code, specs])
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
            return silentCallAsPromise(function (done) {
                runner.run(function() {
                    done(null, reporter)
                })
            })
        })
}

module.exports = {
    run
}
