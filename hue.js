const v3 = require("node-hue-api").v3
const discovery = v3.discovery
const api = v3.api

const appName = "node-hue-api"
const deviceName = "pi-zero"
let lights = []
let ready = false
let hueApi

const start = (username) => {
    v3.discovery
        .nupnpSearch()
        .then((searchResults) => {
            const host = searchResults[0].ipaddress
            return v3.api.createLocal(host).connect(username)
        })
        .then((api) => {
            hueApi = api

            hueApi.lights.getAll().then((allLights) => {
                lights = allLights
                console.log()
                console.log(
                    "**************************************************************************************************",
                )
                console.log("HUE LIGHTS FOUND:")
                console.log(
                    "**************************************************************************************************",
                )
                console.log(
                    lights.map((light) => ({
                        id: light.data.id,
                        name: light.data.name,
                    })),
                )
                console.log(
                    "**************************************************************************************************",
                )
                ready = true
            })
        })
}

const changeLight = (state, ids) => {
    if (ready) {
        // Display the lights from the bridge
        lights.forEach((light) => {
            if (ids.indexOf(light.data.id) !== -1) {
                hueApi.lights.setLightState(light.data.id, state)
            }
        })
    } else {
        setTimeout(() => {
            changeLight(state, ids)
        }, 1000)
    }
}

async function discoverBridge() {
    const discoveryResults = await discovery.nupnpSearch()

    if (discoveryResults.length === 0) {
        console.error("Failed to resolve any Hue Bridges")
        return null
    } else {
        // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
        return discoveryResults[0].ipaddress
    }
}

async function discoverAndCreateUser() {
    const ipAddress = await discoverBridge()

    // Create an unauthenticated instance of the Hue API so that we can create a new user
    const unauthenticatedApi = await api.createLocal(ipAddress).connect()

    let createdUser
    try {
        createdUser = await unauthenticatedApi.users.createUser(
            appName,
            deviceName,
        )
        console.log(
            "*******************************************************************************\n",
        )
        console.log(
            "User has been created on the Hue Bridge. The following username can be used to\n" +
                "authenticate with the Bridge and provide full local access to the Hue Bridge.\n" +
                "YOU SHOULD TREAT THIS LIKE A PASSWORD\n",
        )
        console.log(`Hue Bridge Username: ${createdUser.username}`)
        console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`)
        console.log(`Copy the Username above to config.json`)
        console.log(
            "*******************************************************************************\n",
        )

        // Create a new API instance that is authenticated with the new user we created
        const authenticatedApi = await api
            .createLocal(ipAddress)
            .connect(createdUser.username)

        // Do something with the authenticated user/api
        const bridgeConfig =
            await authenticatedApi.configuration.getConfiguration()
        console.log(
            `Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`,
        )
    } catch (err) {
        if (err.getHueErrorType() === 101) {
            console.error(
                "The Link button on the bridge was not pressed. Please press the Link button and try again.",
            )
        } else {
            console.error(`Unexpected Error: ${err.message}`)
        }
    }
}

module.exports = {
    start,
    changeLight,
    discoverAndCreateUser,
}
