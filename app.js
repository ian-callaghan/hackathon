const flic = require("./flic")
const hue = require("./hue")
const opsgenie = require("./opsgenie")
const config = require("./config.json")

flic.start()
hue.start(config.hue.username)
opsgenie.start(config.opsgenie.apiKey)

opsgenie.getAlerts()
hue.changeLight()
