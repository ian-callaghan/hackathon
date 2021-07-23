const opsgenie = require("opsgenie-sdk")

const start = (apiKey) => {
    opsgenie.configure({
        api_key: apiKey,
    })
}

const getAlerts = (query) => {
    return new Promise((resolve, reject) => {
        var list_alert_json = {
            query,
            offset: 0,
            limit: 1000,
            sort: "alias",
            oder: "desc",
        }

        opsgenie.alertV2.list(list_alert_json, (error, alerts) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                console.log("List Alert Response")
                resolve(alerts)
            }
        })
    })
}

const acknowledgeAlert = (alert) => {
    return new Promise((resolve, reject) => {
        var acknowledge_alert_identifier = {
            identifier: alert.id,
            identifierType: "id",
        }
        var acknowledge_alert_data = {
            note: "acknowledged by flic",
            user: "ian@bluelabs.eu",
            source: "flic button",
        }
        opsgenie.alertV2.acknowledge(
            acknowledge_alert_identifier,
            acknowledge_alert_data,
            (error, result) => {
                if (error) {
                    console.error(error)
                    reject(error)
                } else {
                    console.log("Acknowledge Response")
                    console.log(result)
                    resolve(result)
                }
            },
        )
    })
}

module.exports = {
    start,
    getAlerts,
    acknowledgeAlert,
}
