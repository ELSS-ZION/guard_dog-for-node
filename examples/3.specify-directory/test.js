const guard_dog = require('../../guard_dog')
const path = require('path')
var data = 1
guard_dog.debug = true
guard_dog.init('ABC', (handler) => {
    // simulate network request
    setTimeout(() => {
        handler(data++, 3)
    }, 500)
}, path.join(__dirname, 'dog'))

setInterval(() => {
    guard_dog.get('ABC', (data) => {
        console.log(data)
    })
}, 1000)