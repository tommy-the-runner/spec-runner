'use strict'

const fs = require('fs')
const path = require('path')

const chai = require('chai')
chai.use(require('chai-as-promised'))

const sinon = require('sinon')

const expect = chai.expect

const tommy = require('../lib/runner')

describe('tommy the runner', function () {

    describe('compile', function () {
        it('should handle modules using module.exports', function () {
            const code = `
                module.exports = { a: 5 }
            `

            const result = tommy.compile(code)

            expect(result).to.have.property('a').equal(5)
        })

        it('should handle modules using exports alias', function () {
            const code = `
                exports.a = 5
            `

            const result = tommy.compile(code)

            expect(result).to.have.property('a').equal(5)
        })
    })

    describe('run', function () {
        it('should run valid source code against spec', function () {
            const code = `
                function sum(a, b) {
                    return a + b
                }

                module.exports = sum
            `

            const spec = fs.readFileSync(__dirname + '/../fixtures/spec1.js', 'utf8').toString()
            const result = tommy.run(code, spec)

            return expect(result).to.eventually.have.property('failures').length(0)
        })

        it('should inject custom modules', function () {
            const code = ''

            const spec = fs.readFileSync(__dirname + '/../fixtures/spec2.js', 'utf8').toString()
            const result = tommy.run(code, spec, {
                extraModules: {
                    'get-five': function () { return 5 }
                }
            })

            return expect(result).to.eventually.have.property('failures').length(0)
        })

        it('should run invalid code against spec and report errors', function () {
            const code = `
                function sum(a, b) {
                    return a - b
                }

                module.exports = sum
            `

            const spec = fs.readFileSync(__dirname + '/../fixtures/spec1.js', 'utf8').toString()
            const result = tommy.run(code, spec)

            return expect(result).to.eventually.have.property('failures').length(3)
        })

        it('should reject syntax errors', function () {
            const code = `
                function sum(a, b) {
                    return a + b


                module.exports = sum
            `

            const spec = fs.readFileSync(__dirname + '/../fixtures/spec1.js', 'utf8').toString()
            const result = tommy.run(code, spec)

            return expect(result).to.eventually.be.rejectedWith(/Unexpected token|SyntaxError/)
        })
    })
})
