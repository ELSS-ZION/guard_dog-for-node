const guard_dog = require('../../guard_dog')
var data = 1
guard_dog.setLoader('ABC', (handler) => {
    // simulate network request
    setTimeout(() => {
        handler(data++, 3)
    }, 1000)
})

guard_dog.get('ABC', (data) => {
    console.log(data)
})

setTimeout(() => {
    guard_dog.get('ABC', (data) => {
        console.log('after 5s:', data)
    })
}, 5000)