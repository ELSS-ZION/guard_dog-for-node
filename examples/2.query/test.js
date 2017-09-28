const guard_dog = require('../../guard_dog')
const path = require('path')
var data = 1
guard_dog.setLoader('ABC', (handler) => {
    // simulate network request
    setTimeout(() => {
        handler(data++, 3)
    }, 500)
})

guard_dog.get('ABC', (data) => {
    console.log(data)
})

setTimeout(() => {
    guard_dog.get('ABC', (data) => {
        console.log('after 5s:', data)
    })
}, 5000)