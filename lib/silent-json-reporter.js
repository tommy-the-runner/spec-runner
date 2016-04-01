const Mocha = require('mocha')
const Base = Mocha.reporters.Base

module.exports = SilentJSONReporter

function SilentJSONReporter(runner) {
    Base.call(this, runner);

    var self = this;
    var tests = [];
    var pending = [];
    var failures = [];
    var passes = [];

    runner.on('test end', function(test) {
        tests.push(test);
    });

    runner.on('pass', function(test) {
        passes.push(test);
    });

    runner.on('fail', function(test) {
        failures.push(test);
    });

    runner.on('pending', function(test) {
        pending.push(test);
    });

    runner.on('end', function() {
        var obj = {
            stats: self.stats,
            tests: tests.map(clean),
            pending: pending.map(clean),
            failures: failures.map(clean),
            passes: passes.map(clean)
        };

        runner.testResults = obj;
    });
}

function clean(test) {
    return {
        title: test.title,
        fullTitle: test.fullTitle(),
        duration: test.duration,
        currentRetry: test.currentRetry(),
        err: errorJSON(test.err || {})
    };
}

function errorJSON(err) {
    var res = {};
    Object.getOwnPropertyNames(err).forEach(function(key) {
        res[key] = err[key];
    }, err);
    return res;
}
