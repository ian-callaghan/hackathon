# Hackathon - Hue Genie

Hue Genie is an opsgenie integration that visualises opsgenie alerts using Phillips Hue lights.
Optional use of flic buttons to acknowledge alerts is included.

## Configuration

### Pairing a Hue Bridge

run `node setupHue.js` to pair a hue a bridge and note the output Username in the console.

### Pairing a Flic button

Requires the flic SDK daemon to be running on localhost: https://github.com/50ButtonsEach/fliclib-linux-hci

run `node setupNewButton.js` and follow the on screen instructions to pair a flic button with the Flic SDK daemon.

### Required JSON settings

Open `config.json` ad enter the following:

-   hue.username - the username obtained from instructions above
-   hue.lightIds - Lights to use (all available light ids are displayed on app startup)
-   opsgenie.apiKey - api key generated in opsgenie
-   opsgenie.query - query that triggers visualisation when results exist

## Usage

Run the application with `node app.js` and the opsGenie query will be run every 10 seconds in the background.

If any alerts are returned the Hue lights will flash between the specified colours from the `config.json`.

Once the alerts are acknowledge the Hue lights will return to a bright white colour.

If a Flic button is paired, pressing it will acknowledge all alerts from the query.
