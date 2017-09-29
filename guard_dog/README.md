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

+ `key` *< string, required >* The key of data, the name of the **.dog** file.
+ `loader` *< function, required >* Will refresh this data by call this function when it needs.
+ `dir`  *< string, optional >* The **.dog** file stored directory.

#### loader:

```js
(handler) => {
    handler()
}
```

#### handler( `data`, `expires_in`, `ahead` )

- `data` *< string/object, required >* Data need to store.
- `expires_in` *< integer, required >*  Unit is second, data only availability during this time.
- `ahead` *< integer, optional >* Unit is second, defualt is 2s. It means guard_dog will refresh data 2s earlier before it expired by default.


Note: If (`expires_in` - `ahead` <= 0), it will never be refreshed.

```js
guard_dog.init('KEY', (handler) => {
    handler(data, 3) // It will be refreshed every second
})
```

### guard_dog.get( `key`, `callback` )
+ `key` *< string, required >* The key you pass when you call `guard_dog.init()`
+ `callback` *< function, required >* `(data) => {}`

Before calling this function, `guard_dog.init()` must be called.

```js
guard_dog.get('KEY', (data) => {
    console.log(data)
})
```
---
## Examples
+ [guard_dog examples](https://github.com/ELSS-ZION/guard_dog-for-node/tree/master/examples)