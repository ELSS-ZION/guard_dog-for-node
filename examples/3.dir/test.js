const guard_dog = require('../../guard_dog')
const path = require('path')
var data = 1
guard_dog.setLoader('ABC', (handler) => {
    // simulate network request
    setTimeout(() => {
        handler(data++, 3, 'dog')
    }, 500)
})

guard_dog.get('ABC', (data) => {
    console.log(data)
})