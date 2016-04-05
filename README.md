# spec-runner [![wercker status](https://app.wercker.com/status/a9ef7c315f4b1d5c637896ca2ddd4ced/s/master "wercker status")](https://app.wercker.com/project/bykey/a9ef7c315f4b1d5c637896ca2ddd4ced)

Evaluate string with code against provided test suite.

## Installation

`npm install tommy-the-runner --save`

## Api

#### tommy.run(code, specs)

Execute tests. Returns Promise resolved with reporter or rejected with eval error

`code` is a String with javascript code to evaluate 

`specs` is a String with mocha test suite written using bdd interface.

Module exported in `code` is available under `require('subject')` in `specs` code 


#### tommy.compile(code)

Compile CommonJS module. Returns value of `module.exports`

`code` is a String with javascript code to evaluate 

## Example

```javascript
const tommy = require('tommy-the-runner')

const code = `
  function sum(a, b) {
    return a + b
  }
  
  module.exports = sum
`

const specs = `
  const expect = require('chai').expect
  
  const sum = require('subject')
  
  describe('sum', function () {
    it('should sum two numbers', function () {
      expect(sum(1, 1)).to.equal(2)
    })
  })
`

tommy.run(code, specs)
  .then(reporter => {
    console.log(reporter.stats)
  })
  .catch(err => {
    console.log('Execution error', err)
  })
```

result: 
```javascript
{ suites: 2,
  tests: 1,
  passes: 1,
  pending: 0,
  failures: 0,
  start: 'Tue Apr 05 2016 22:22:10 GMT+0200 (CEST)',
  end: 'Tue Apr 05 2016 22:22:10 GMT+0200 (CEST)',
  duration: 4 }
```
