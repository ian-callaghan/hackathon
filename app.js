const flic = require("./flic")
const hue = require("./hue")
const opsgenie = require("./opsgenie")
const config = require("./config.json")
const v3 = require("node-hue-api").v3
const LightState = v3.lightStates.LightState

const states = config.hue.alertStates
let stateIndex = 0
let alertData = []
let isAlerting = false

const start = async () => {
    flic.start(onButtonInput)
    hue.start(config.hue.username)
    opsgenie.start(config.opsgenie.apiKey)
}

const onButtonInput = (clickType) => {
    if (clickType === "ButtonDown") {
        acknowledgeAlerts()
    }
}

const acknowledgeAlerts = async () => {
    alertData.forEach(async (alert) => {
        await opsgenie.acknowledgeAlert(alert)
    })
    alertData = []
    setTimeout(async () => {
        await getAlerts()
    }, 1000)
}

const getAlerts = async () => {
    alertData = (await opsgenie.getAlerts(config.opsgenie.query)).data
    if (alertData.length > 0) {
        isAlerting = true
        console.log("we have alerts")
    } else {
        if (isAlerting) {
            const state = new LightState().on().white(225, 100)
            hue.changeLight(state, config.hue.lightIds)
            isAlerting = false
        }
        console.log("all is well")
    }
}

const toggleLight = () => {
    const stateData = states[stateIndex]
    const state = new LightState()
        .on()
        .hue(stateData.hue)
        .saturation(stateData.saturation)
        .brightness(stateData.brightness)

    stateIndex++
    if (stateIndex >= states.length) {
        stateIndex = 0
    }

    hue.changeLight(state, config.hue.lightIds)
}

start()
getAlerts()

setInterval(async () => {
    getAlerts()
}, 10000)

setInterval(() => {
    if (alertData.length > 0) {
        toggleLight()
    }
}, config.hue.alertToggleDuration)
