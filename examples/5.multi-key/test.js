const guard_dog = require('../../guard_dog')

guard_dog.init('A', (handler) => {
    setTimeout(() => {
        handler('a', 20)
    }, 5000)
})

guard_dog.init('B', (handler) => {
    // B need A
    guard_dog.get('A', (data) => {
        setTimeout(() => {
            handler('b' + data, 20)
        }, 1000)
    })
})

guard_dog.get('B', (data) => {
    console.log(data)
})