const {
    IPC
} = require('./');

const t = new IPC();

t.connect({
    client_id: "453849553913774082"
})

t.on('message', function (msg) {
    console.log(msg);
})

t.on('ready', function () {
    t.send({
        "nonce": "5bb10a43-1fdc-4391-9512-0c8f4aa203d4",
        "args": {
            "access_token": "vd25ECG2oJeG35jqyJP5eLu3qJM6IU"
        },
        "cmd": "AUTHENTICATE"
    })
});

t.on('AUTHENTICATE', function (ev) {
    console.log('authicated');
    console.log(ev);
    t.send({
        "nonce": "6bb10a43-1fdc-4391-9512-0c8f4aa203d4",
        "args": {
            "pid": 11076,
            "activity": {
                // "name": "Firefox",
                "state": "發呆中",
                "details": "猜猜我在幹嘛？",
                // "timestamps": {
                //     "start": Date.now(),
                //     "end": Date.now() + ((60 * 5) + 23) * 1000
                // },
                "assets": {
                    "large_text": "Wow such firefox",
                    "large_image": "largeicon",
                    // "small_text": "SO what the fuck?",
                    // "small_image": "smallicon"
                }
            }
        },
        "cmd": "SET_ACTIVITY"
    })
})

t.on('close', function (e) {
    console.log(e)
})