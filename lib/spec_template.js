'use strict'

function render(specs) {
    return `
    module.exports = function (ctx, require) {

        // <Preambule>
        const describe = ctx.describe
        const it = ctx.it
        const before = ctx.before
        const beforeEach = ctx.beforeEach
        const after = ctx.after
        const afterEach = ctx.afterEach
        // </Preambule>

        ${specs}
    }
    `
}

module.exports = {
    render
}
