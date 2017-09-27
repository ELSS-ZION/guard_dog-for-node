# guard_dog

+ Data Persistence ( data will be saved in a .dog file as json )
+ Memory Cache ( guard_dog.get( ) )
+ Auto Timed Refresh ( handler( ) )

---
## Installation

```bash
$ npm install guard_dog
```
---
## Usage
1. require( `module_name` )
``` js
const guard_dog = require('guard_dog')
```

2. guard_dog.setLoader( `key`, `loader` )

    `guard_dog` will refresh this data with this key by call this `loader` when it need.
    + loader format:
    ```
    (handler) => {
        handler()
    }
    ```

    + handler( `data`, `expires_in`, `ahead` )
    ```
    data: Data need to store, can be string or json object.

    expires_in:  Unit is second, data only availability during this time.

    ahead: Unit is second, defualt is 2s. It means guard_dog will refresh data 2s earlier before it expired by default.
    ```

    + note: if (`expires_in` - `ahead` <= 0), it will never be refreshed.
``` js
guard_dog.setLoader('KEY', (handler) => {
    handler(data, 3) // It will be refreshed every second
})
```

3. guard_dog.get( `key`, `callback` )
``` js
guard_dog.get('KEY', (data) => {
    console.log(data)
})
```
---
## Examples
+ [guard_dog examples](https://github.com/ELSS-ZION/guard_dog-for-node/tree/master/examples)