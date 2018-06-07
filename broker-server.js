const {
    IPC
} = require('./');

const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 6473,
    verifyClient(info, cb) {
        if (info.origin.match(/^moz-extension:\/\//)) {
            cb(true)
        } else {
            cb(false, 403);
        }
    }
});


wss.on('connection', function connection(ws, request) {
    const client_id = /client_id=([^&]+)/.exec(request.url)[1];
    const access_token = /access_token=([^&]+)/.exec(request.url)[1];

    console.log(client_id, access_token)

    console.log('new connection coming!');

    var client = new IPC();

    ws.on('close', function () {
        try { 
            client.close();
        } catch (e) {}
    })

    ws.on('error', function () {
        try { 
            client.close()
        } catch (e) {}
    })

    client.on('close', function () {
        try { 
            ws.close();
        } catch (e) {}
    })

    client.on('message', function (msg) {
        console.log(msg)
        ws.send(JSON.stringify(msg));
    })

    client.connect({ client_id })    

    client.on('ready', function () {
        console.log('client ready, start to send authentcation info');

        client.send({
            "nonce": Math.random().toString(16).slice(2),
            "args": {  access_token },
            "cmd": "AUTHENTICATE"
        })
    })
    
    client.on('AUTHENTICATE', function (ev) {
        console.log('client authentcated sucessfully')
        ws.on('message', function incoming(message) {
            try {
                client.send(JSON.parse(message))
            } catch (e) {}
        });
    })
});

wss.on('listening', function () {
    console.log('broker server is up now!')
})
wss.on('error', function (err) {
    console.error('broker server encountered an error!', err)
})