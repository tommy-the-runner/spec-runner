'use strict'

function render(specs) {
    return `
    module.exports = function (ctx, require) {

        var describe = ctx.describe
        var xdescribe = ctx.xdescribe
        var context = ctx.context
        var xcontext = ctx.xcontext
        var it = ctx.it
        var xit = ctx.xit
        var before = ctx.before
        var beforeEach = ctx.beforeEach
        var after = ctx.after
        var afterEach = ctx.afterEach

        ${specs}
    }
    `
}

module.exports = {
    render
}
