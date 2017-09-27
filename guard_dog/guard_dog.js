const fs = require('fs')
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
            }
        }
    }
*/
function start () {
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
        startTimeout(obj)
    }
    var now = new Date().getTime()
    var expries_time = obj.props.expires_in * 1000 + obj.props.gen_time
    if (expries_time < now) {
        obj.loader(() => {
            callback(obj.props.data)
        })
        return
    }
    callback(obj.props.data)
}

exports.setLoader = function (key, loader) {
    var obj = cache[key] = {}
    cache[key].loader = function (callback) {
        var time = new Date().getTime()
        loader((data, expires_in, ahead) => {
            expires_in = typeof(expires_in)=='undefined' ? 0 : expires_in
            ahead = typeof(ahead)=='undefined' ? 2 : ahead
            cache[key].props = {
                data: data,
                expires_in: expires_in,
                gen_time: time,
                ahead: ahead
            }
            fs.writeFileSync(key + extname, JSON.stringify(cache[key].props))
            startTimeout(obj)
            if (callback) {
                callback()
            }
        })
    }
}

function startTimeout (obj) {
    var interval = obj.props.expires_in - obj.props.ahead
    if (interval < 0 || interval == 0) {
        return
    }
    setTimeout(() => {
        obj.loader()
    }, interval * 1000)
}