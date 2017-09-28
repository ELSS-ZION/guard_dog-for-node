const guard_dog = require('../../guard_dog')

guard_dog.init('ABC', (handler) => {
    setTimeout(() => {
        handler('abc', 5)
    }, 1000)
})
module.exports = function (callback) {
    guard_dog.get('ABC', callback)
}