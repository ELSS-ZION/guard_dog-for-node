const ABC = require('./ABC')
const guard_dog = require('../../guard_dog')

setInterval(() => {
    ABC((data) => {
        console.log(data)
    })
}, 1000)