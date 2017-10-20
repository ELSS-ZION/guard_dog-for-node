const fs = require('fs')
const path = require('path')
const extname = '.dog'
const cache = {}
/*
    cache = {
        KEY: {
            dir: DIR,
            loader: Function,
            props: {
                data: DATA,
                expires_in: EXPIRES_IN,
                gen_time: GEN_TIME,
                ahead: AHEAD
            },
            isLoading: BOOL,
            timer: TIMER,
            cb_queue: [Function],
            isQueuing: BOOL
        }
    }
*/
function start(key) {
    var obj = cache[key]
    obj.isQueuing = true
    if (obj.cb_queue.length == 0) {
        obj.isQueuing = false
        return
    }
    get(key, (data) => {
        obj.cb_queue[0](data)
        obj.cb_queue.shift()
        start(key)
    })
}

exports.get = function (key, callback) {
    var obj = cache[key]
    if (!obj.cb_queue) {
        obj.cb_queue = []
    }
    obj.cb_queue.push(callback)
    if (!obj.isQueuing) start(key)
}

function get(key, callback) {
    var obj = cache[key]
    var fileName = path.join(obj.dir, key + extname)
    if (!fs.existsSync(fileName)) {
        log(key, 'file not exists')
        obj.loader(() => {
            callback(obj.props.data)
        })
        return
    }
    if (!obj.props) {
        var str = fs.readFileSync(fileName, 'utf-8')
        try {
            obj.props = JSON.parse(str)
        } catch (error) {
            log(key, 'file content error')
            obj.loader(() => {
                callback(obj.props.data)
            })
            return
        }
        log(key, 'file be read')
        resetTimeout(obj)
    }
    var now = new Date().getTime()
    var expries_time = obj.props.expires_in * 1000 + obj.props.gen_time
    if (expries_time < now) {
        log(key, 'data expired')
        obj.loader(() => {
            callback(obj.props.data)
        })
        return
    }

    callback(obj.props.data)
}

exports.init = function (key, loader, dir) {
    dir = typeof (dir) == 'undefined' ? '' : dir
    var obj = cache[key] = {
        dir: dir
    }
    obj.loader = function (callback) {
        if (obj.isLoading && !callback) {
            return
        }
        log(key, 'loading')
        obj.isLoading = true
        var time = new Date().getTime()
        loader((data, expires_in, ahead) => {

            expires_in = typeof (expires_in) == 'undefined' ? 0 : expires_in

            ahead = typeof (ahead) == 'undefined' ? 2 : ahead
            obj.props = {
                data: data,
                expires_in: expires_in,
                gen_time: time,
                dir: dir,
                ahead: ahead
            }
            fs.writeFileSync(path.join(dir, key + extname), JSON.stringify(cache[key].props))

            if (callback) {
                callback()
            }
            obj.isLoading = false
            log(key, 'loaded')
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

function log() {
    if (!exports.debug) {
        return
    }
    var arr = new Array()
    for (var i in arguments) {
        arr[i] = arguments[i]
    }
    if (arguments.length) {
        arr.shift()
        arr.unshift('[' + arguments[0] + ']')
    }
    arr.unshift('\x1b[36mguard_dog:')
    arr.push('\x1b[0m')
    console.log.apply(this, arr)
}
exports.debug = false