var log = function () {
    // var arr = new Array()
    // for (var i in arguments) {
    //     arr[i] = arguments[i]
    // }
    // arr.unshift('guard_dog:')
    // console.log.apply(this, arr)
}

const fs = require('fs')
const path = require('path')
const extname = '.dog'
const cache = {}
const query = []
var isStarting = false
/*
    cache = {
        KEY: {
            loader: Function,
            props: {
                data: DATA,
                expires_in: EXPIRES_IN,
                gen_time: GEN_TIME,
                ahead: AHEAD
            },
            isLoading: false,
            timer: TIMER
        }
    }
*/
function start() {
    isStarting = true
    if (query.length == 0) {
        isStarting = false
        return
    }
    get(query[0].key, (data) => {
        query[0].callback(data)
        query.shift()
        start()
    })
}
exports.get = function (key, callback) {
    query.push({
        key: key,
        callback: callback
    })
    if (!isStarting) start()
}

function get(key, callback) {
    var obj = cache[key]
    var fileName = key + extname
    if (!fs.existsSync(fileName)) {
        obj.loader(() => {
            callback(obj.props.data)
        })
        return
    }
    if (!obj.props) {
        var str = fs.readFileSync(fileName, 'utf-8')
        obj.props = JSON.parse(str)
        log('readed')
        resetTimeout(obj)
    }
    var now = new Date().getTime()
    var expries_time = obj.props.expires_in * 1000 + obj.props.gen_time
    if (expries_time < now) {
        log('expired')
        obj.loader(() => {
            callback(obj.props.data)
        })
        return
    }

    callback(obj.props.data)
}

exports.setLoader = function (key, loader) {
    var obj = cache[key] = {}
    obj.loader = function (callback) {
        if (obj.isLoading && !callback) {
            return
        }
        log('loading', obj.isLoading, !!callback)
        obj.isLoading = true
        var time = new Date().getTime()
        loader((data, expires_in, dir, ahead) => {
            
            expires_in = typeof (expires_in) == 'undefined' ? 0 : expires_in
            dir = typeof (dir) == 'undefined' ? '' : dir
            ahead = typeof (ahead) == 'undefined' ? 2 : ahead
            obj.props = {
                data: data,
                expires_in: expires_in,
                gen_time: time,
                ahead: ahead
            }
            fs.writeFileSync(path.join(dir, key + extname), JSON.stringify(cache[key].props))
            
            if (callback) {
                callback()
            }
            obj.isLoading = false
            log('done')
            resetTimeout(obj)
        })
    }
    exports.get(key, () => {})
}

function resetTimeout(obj) {
    clearTimeout(obj.timer)
    var interval = obj.props.expires_in - obj.props.ahead
    if (interval < 0 || interval == 0) {
        return
    }
    obj.timer = setTimeout(() => {
        obj.loader()
    }, interval * 1000)
}