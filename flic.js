const fliclib = require("./fliclib/fliclibNodeJs")

let client = new fliclib.FlicClient("localhost", 5551)
client.on("error", (e) => {
    console.log(`Flic ${e}`)
})

const listenToButton = (bdAddr) => {
    var cc = new fliclib.FlicConnectionChannel(bdAddr)
    client.addConnectionChannel(cc)
    cc.on("buttonUpOrDown", (clickType, wasQueued, timeDiff) => {
        console.log(
            bdAddr +
                " " +
                clickType +
                " " +
                (wasQueued ? "wasQueued" : "notQueued") +
                " " +
                timeDiff +
                " seconds ago",
        )
    })
    cc.on(
        "connectionStatusChanged",
        function (connectionStatus, disconnectReason) {
            console.log(
                bdAddr +
                    " " +
                    connectionStatus +
                    (connectionStatus == "Disconnected"
                        ? " " + disconnectReason
                        : ""),
            )
        },
    )
}

const start = () => {
    client.once("ready", () => {
        console.log("Connected to daemon!")
        client.getInfo(function (info) {
            info.bdAddrOfVerifiedButtons.forEach((bdAddr) => {
                listenToButton(bdAddr)
            })
        })
    })
}

module.exports = {
    start,
}
