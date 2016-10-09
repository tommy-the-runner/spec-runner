const chai = require('chai')
const expect = chai.expect

const getFive = require('get-five')

describe('getFive', function () {
    it('should be five', function () {
        expect(getFive()).to.equal(5)
    })
})
