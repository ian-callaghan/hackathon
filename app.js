const flic = require("./flic")
const hue = require("./hue")
const opsgenie = require("./opsgenie")

flic.start()
hue.start("I8FXh9MtDVB8zYEx-ZO-duKj3vzxw3ZgkDa0oMUM")
opsgenie.start("6c5c994e-059d-4674-9958-adb5f62c6b01")

opsgenie.getAlerts()
hue.changeLight()
