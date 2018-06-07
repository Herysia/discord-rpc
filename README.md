# Discord Rpc Broker

A simple broker to accept websocket conenction from moz-extension:// domain and translate to discord ipc

Usage:

```sh
npm install
node broker-server.js
```

Connect:

```js
// get the access token based on the normal auth flow
// you must add rpc and rpc.api to the scope
// otherwise it won't work
// port is hardcoded to 6473
// page origin must start with moz-extension:// 

const mySocket = new WebSocket(
    `ws://127.0.0.1:6473/?client_id=${client_id}&access_token=${access_token}`
);

mySocket.onmessage = async function(e) {
    console.log(e);
    try {
        /**
         * contains data send form server
         */
        var data = JSON.parse(e.data);

        if (data.cmd === "AUTHENTICATE") {
            // do what ever you want after this event fired
            mySocket.send(JSON.stringify({
                "nonce": "Some randome string",
                "args": {/* something */},
                "cmd": "command you want to call"
            }))
        }
    } catch (e) {
        // malformated packets
        // if it goes here, you are encuntered a bug
        // and feel free to complain on the issue borad
    }
}
```

# API (node.js)

```js
const { IPC } = require('./');

const t = new IPC();

t.connect({ client_id })

t.on('message', function (msg) {
    console.log(msg);
})

t.on('ready', function () {
    t.send({
        "nonce": "5bb10a43-1fdc-4391-9512-0c8f4aa203d4",
        "args": { access_token },
        "cmd": "AUTHENTICATE"
    })
});

t.on('AUTHENTICATE', function (ev) {
    // do something
})
```

# Credits 

Some code borrows from  
https://github.com/discordjs/RPC
<span style="font-size:4px">
    <del>
        Why would you include so many bugs and unused dependencies in the repo?
    </del>
</sapn>
