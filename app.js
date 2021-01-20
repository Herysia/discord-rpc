const AutoLaunch = require("auto-launch");
const SysTray = require("systray").default;
const ico = require("./ico.js");
const path = require("path");
/**
 * Autostart section
 */
const split = process.execPath.split('\\');
let autoLaunch = new AutoLaunch({
    name: "matchmaker",
    path: split.slice(0, split.length -1).join('\\') + '\\run.vbs'
});
console.log(process.execPath)
let tray = null;
autoLaunch.isEnabled().then((isEnabled) => {
    /**
     * System tray section
     */
    const toggleStartup = (checked) => {
        if (checked) autoLaunch.enable();
        else autoLaunch.disable();
    };
    const systray = new SysTray({
        menu: {
            // you should using .png icon in macOS/Linux, but .ico format in windows
            icon: ico,
            title: "Matchmaker",
            tooltip: "Matchmaker",
            items: [
                {
                    title: "Exécuter au démarrage",
                    checked: isEnabled,
                    enabled: true,
                },
                {
                    title: "Quitter",
                    enabled: true,
                },
            ],
        },
        debug: false,
        copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
    });
    systray.onClick((action) => {
        if (action.seq_id === 0) {
            systray.sendAction({
                type: "update-item",
                item: {
                    ...action.item,
                    checked: !action.item.checked,
                },
                seq_id: action.seq_id,
            });
            toggleStartup(!action.item.checked);
        } else if (action.seq_id === 1) {
            systray.kill();
        }
    });
});

/**
 * IPC section
 */
const { IPC } = require("./index.js");

const WebSocket = require("ws");

const wss = new WebSocket.Server({
    port: 6473,
    verifyClient(info, cb) {
        cb(true);
        /*
      if (info.origin.match(/^moz-extension:\/\//)) {
          cb(true)
      } else {
          cb(false, 403);
      }
  */
    },
});

wss.on("connection", function connection(ws, request) {
    const client_id = /client_id=([^&]+)/.exec(request.url)[1];

    //console.log(client_id);

    //console.log("new connection coming!");

    var client = new IPC();

    ws.on("close", function () {
        try {
            client.close();
        } catch (e) {}
    });

    ws.on("error", function () {
        try {
            client.close();
        } catch (e) {}
    });

    ws.on("message", function incoming(message) {
        try {
            client.send(JSON.parse(message));
        } catch (e) {}
    });

    client.on("close", function () {
        try {
            ws.close();
        } catch (e) {}
    });

    client.on("message", function (msg) {
        //console.log(msg);
        ws.send(JSON.stringify(msg));
    });

    client.connect({ client_id });
});

wss.on("listening", function () {
    console.log("broker server is up now!");
});
wss.on("error", function (err) {
    console.error("broker server encountered an error!", err);
});
