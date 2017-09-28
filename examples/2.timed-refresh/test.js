const guard_dog = require('../../guard_dog')
const path = require('path')
var data = 1
guard_dog.setLoader('ABC', (handler) => {
    // simulate network request responds very slow
    setTimeout(() => {
        handler(data++, 5)
    }, 5000)
})

setInterval(() => {
    guard_dog.get('ABC', (data) => {
        console.log(data)
    })
}, 1000)