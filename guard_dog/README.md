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

### guard_dog.init( `key`, `loader`, `dir`)

+ `key` *< string >* the key of data cache
+ `loader` *< function >* `guard_dog` will refresh this data with this key by call this `loader` when it need.
+ `dir`  *< string >*  Specify .dog file stored directory

loader format:

> (handler) => {
>   handler()
> }

handler( `data`, `expires_in`, `ahead` )

> data: Data need to store, can be string or json object.
> 
> expires_in:  Unit is second, data only availability during this time.
> 
> ahead: Unit is second, defualt is 2s. It means guard_dog will refresh data 2s earlier before it expired by default.


Note: if (`expires_in` - `ahead` <= 0), it will never be refreshed.

Example:
``` js
guard_dog.setLoader('KEY', (handler) => {
    handler(data, 3) // It will be refreshed every second
})
```

### guard_dog.get( `key`, `callback` )
+ `key` *< string >* the key you pass when you call `guard_dog.init()`
+ `callback` *< function >* `(data) => {}`

Before call this function, must call `guard_dog.init()`

Example:
``` js
guard_dog.get('KEY', (data) => {
    console.log(data)
})
```
---
## Examples
+ [guard_dog examples](https://github.com/ELSS-ZION/guard_dog-for-node/tree/master/examples)