const opsgenie = require("opsgenie-sdk")

const start = (apiKey) => {
    opsgenie.configure({
        api_key: apiKey,
    })
}

const getAlerts = () => {
    var list_alert_json = {
        query: "status : open",
        offset: 0,
        limit: 10,
        sort: "alias",
        oder: "desc",
    }

    opsgenie.alertV2.list(list_alert_json, (error, alerts) => {
        if (error) {
            console.error(error)
        } else {
            console.log("List Alert Response")
            console.log(alerts)
        }
    })
}

module.exports = {
    start,
    getAlerts,
}
