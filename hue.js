const v3 = require("node-hue-api").v3
const LightState = v3.lightStates.LightState
// The name of the light we wish to retrieve by name

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
                ready = true
            })
        })
}

const changeLight = () => {
    if (ready) {
        const state = new LightState()
            .on()
            .hue(65535)
            .saturation(75)
            .brightness(100)
        // Display the lights from the bridge
        //console.log(JSON.stringify(allLights, null, 2));
        lights.forEach((light) => {
            hueApi.lights.setLightState(light.data.id, state)
        })
    } else {
        setTimeout(() => {
            changeLight()
        }, 1000)
    }
}

module.exports = {
    start,
    changeLight,
}

/*
const discovery = v3.discovery
const hueApi = v3.api
const appName = 'node-hue-api';
const deviceName = 'pi-zero';

async function discoverBridge() {
const discoveryResults = await discovery.nupnpSearch();

  if (discoveryResults.length === 0) {
    console.error('Failed to resolve any Hue Bridges');
    return null;
  } else {
    // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
    return discoveryResults[0].ipaddress;
  }
}

async function discoverAndCreateUser() {
  const ipAddress = await discoverBridge();

  // Create an unauthenticated instance of the Hue API so that we can create a new user
  const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect();
  
  let createdUser;
  try {
    createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);
    console.log('*******************************************************************************\n');
    console.log('User has been created on the Hue Bridge. The following username can be used to\n' +
                'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
                'YOU SHOULD TREAT THIS LIKE A PASSWORD\n');
    console.log(`Hue Bridge User: ${createdUser.username}`);
    console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
    console.log('*******************************************************************************\n');

    // Create a new API instance that is authenticated with the new user we created
    const authenticatedApi = await hueApi.createLocal(ipAddress).connect(createdUser.username);

    // Do something with the authenticated user/api
    const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
    console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);

  } catch(err) {
    if (err.getHueErrorType() === 101) {
      console.error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  }
}

// Invoke the discovery and create user code
discoverAndCreateUser();
*/
