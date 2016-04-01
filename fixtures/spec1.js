const chai = require('chai')
const expect = chai.expect

const sum = require('subject')

describe('my function', function () {
    it('should return sum of positive numbers', function () {
        const total = sum(3, 5)

        expect(total).to.equal(8)
    })

    it('should return sum of negative numbers', function () {
        const total = sum(-3, -5)

        expect(total).to.equal(-8)
    })

    it('should accept 0 as neutral operand', function () {
        const total = sum(0, 3)

        expect(total).to.equal(3)
    })
})
