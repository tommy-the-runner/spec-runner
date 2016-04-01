'use strict'

const fs = require('fs')
const path = require('path')

const chai = require('chai')
chai.use(require('chai-as-promised'))

const sinon = require('sinon')

const expect = chai.expect

const tommy = require('../lib/runner')

const getFileContents = function () {
    const filePath = path.resolve.apply(this, arguments)
    const fileContent = fs.readFileSync(filePath)

    return fileContent.toString()
}

describe('tommy the runner', function () {
    it('should run valid source code against spec', function () {
        const code = `
            function sum(a, b) {
                return a + b
            }

            module.exports = sum
        `

        const spec = getFileContents(__dirname, '..', 'fixtures', 'spec1.js')
        const result = tommy.run(code, spec)

        return expect(result).to.eventually.have.property('failures').length(0)
    })

    it('should run invalid code against spec and report errors', function () {
        const code = `
            function sum(a, b) {
                return a - b
            }

            module.exports = sum
        `

        const spec = getFileContents(__dirname, '..', 'fixtures', 'spec1.js')
        const result = tommy.run(code, spec)

        return expect(result).to.eventually.have.property('failures').length(3)
    })
})
