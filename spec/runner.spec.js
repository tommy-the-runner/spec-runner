'use strict'

const fs = require('fs')
const path = require('path')
var test = require('tape')
var testAsync = require('blue-tape')

const tommy = require('../lib/runner')

test('tommy the runner  - compile  - should handle modules using module.exports', function (t) {
    t.plan(1)

    const code = `module.exports = { a: 5 }`
    const result = tommy.compile(code)

    t.equal(result.a, 5)
    t.end()
})

test('tommy the runner  - compile  - should handle modules using exports alias', function (t) {
    t.plan(1)

    const code = `exports.a = 5`
    const result = tommy.compile(code)

    t.equal(result.a, 5)
    t.end()
})


testAsync('tommy the runner - run - should run valid source code against spec', function (t) {
    const code = `
        function sum(a, b) {
            return a + b
        }

        module.exports = sum
    `

    const spec = fs.readFileSync(__dirname + '/../fixtures/spec1.js', 'utf8').toString()
    const result = tommy.run(code, spec)

    return result.then((suite) => {
        t.equal(suite.failures.length, 0)
    })
})

testAsync('tommy the runner - run - should allow to configure subject package name', function (t) {
    const code = `
        function sum(a, b) {
            return a + b
        }

        module.exports = sum
    `

    const spec = fs.readFileSync(__dirname + '/../fixtures/spec1a.js', 'utf8').toString()
    const result = tommy.run(code, spec, {subjectPackageName: 'your code here'})

    return result.then((suite) => {
        t.equal(suite.failures.length, 0)
    })
})

testAsync('tommy the runner - run - should inject custom modules', function (t) {
    const code = ''

    const spec = fs.readFileSync(__dirname + '/../fixtures/spec2.js', 'utf8').toString()
    const result = tommy.run(code, spec, {
        extraModules: {
            'get-five': function () { return 5 }
        }
    })

    return result.then((suite) => {
        t.equal(suite.failures.length, 0)
    })
})

testAsync('tommy the runner - run - should run invalid code against spec and report errors', function (t) {
    const code = `
        function sum(a, b) {
            return a - b
        }
        module.exports = sum
    `

    const spec = fs.readFileSync(__dirname + '/../fixtures/spec1.js', 'utf8').toString()
    const result = tommy.run(code, spec)

    return result.then((suite) => {
        t.equal(suite.failures.length, 3)
    })
})

testAsync('tommy the runner - run - should reject syntax errors', function (t) {
    const code = `
        function sum(a, b) {
            return a + b
        module.exports = sum
    `

    const spec = fs.readFileSync(__dirname + '/../fixtures/spec1.js', 'utf8').toString()
    const result = tommy.run(code, spec)

    return result.catch((err) => {

        t.ok(err.toString().match(/Unexpected token|SyntaxError/))
    })
})

testAsync('should support all functions from BDD interface', function (t) {
    const code = ``
    const spec = fs.readFileSync(__dirname + '/../fixtures/spec3.js', 'utf8').toString()
    const result = tommy.run(code, spec)

    return result
})
