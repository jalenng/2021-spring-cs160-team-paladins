const { ipcMain } = require('electron');
const psShell = require('node-powershell');
const isWindows = process.platform == 'win32';

const APP_SNAPSHOT_INTERVAL = 10000;
const POWERSHELL_GET_PROCESS_COMMAND =
    `Get-Process | Where-Object {$_.mainWindowTitle} | Select-Object Name, mainWindowtitle, Description, Path | ConvertTo-Json | % {$_ -replace("\\u200B")} | % {$_ -replace("\\u200E")}`;

const states = {
    RUNNING: 'running',
    STOPPED: 'stopped',
}

function AppSnapshotSystem() {

    this._events = {};
    
    this.state = states.STOPPED;
    this.lastSnapshot = [];

    /**
     * Registers an event listener
     */
    this.on = function (name, listener) {
        if (!this._events[name]) {
            this._events[name] = [];
        }

        this._events[name].push(listener);
    }

    /**
     * Takes a snapshot of the list of open windows, and update the dictionary of friendly app names accordingly.
     * This emits the 'app-snapshot-taken' event.
     * @returns {[Object]} List of open windows
     */
    this.takeAppSnapshot = async function () {
        let result = [];

        // WINDOWS: Invoke PowerShell command to get open windows
        if (isWindows) {
            try {
                let newAppNames = {};

                // Set up PowerShell child process, invoke command, then kill it.
                const ps = new psShell({
                    executionPolicy: 'Bypass',
                    noProfile: true
                }); 
                ps.addCommand(POWERSHELL_GET_PROCESS_COMMAND);
                const psOutput = await ps.invoke();
                ps.dispose();

                // Evaluate the JSON string output to a JSON object
   
                const psJson = eval(psOutput)

                psJson.forEach(process => {
                    const winTitle = process.MainWindowTitle;
                    const winDesc = process.Description;
                    const winPath = process.Path;

                    // Push process to list of open windows
                    result.push({
                        path: winPath,
                        duration: APP_SNAPSHOT_INTERVAL
                    });
                    
                    // Perform processing to get the ideal name
                    if (winTitle.indexOf(winDesc) === -1 || winDesc === '')
                        newAppNames[winPath] = winTitle;
                    else
                        newAppNames[winPath] = winDesc;
                })

                // Update the app names dictionary
                let appNamesDict = global.store.get('appNames');
                appNamesDict = {...appNamesDict, ...newAppNames};
                global.store.set('appNames', appNamesDict);

            }
            catch (error) { console.log(error) }
        }

        // Call app-snapshot-taken listeners
        const fireCallbacks = (callback) => callback(result);
        this._events['app-snapshot-taken'].forEach(fireCallbacks);

        lastSnapshot = result;

        return result;
    }

    /**
     * Starts the app snapshot system.
     */
    this.startSystem = function () {
        if (this.state == states.STOPPED) {
            // Set interval to take snapshots of open processes
            interval = setInterval(this.takeAppSnapshot.bind(this), APP_SNAPSHOT_INTERVAL);

            this.state = states.RUNNING;

            //Take first snapshot
            this.takeAppSnapshot();
        }
    }

    /**
     * Stops the app snapshot system.
     */
    this.stopSystem = function () {
        if (this.state == states.RUNNING) {
            clearInterval(interval);
            this.state = states.STOPPED;
        }
    }

    this.getLastSnapshot = function () {
        return lastSnapshot;
    }
}


/* Instantiate the data usage system */
global.appSnapshotSystem = new AppSnapshotSystem();


/* Start the system depending on user preferences */

// On app startup, check whether to start the system.
if (checkWhetherToStartSystem())
    global.appSnapshotSystem.startSystem();


// Update the status of the system based on user preferences.
store.onDidChange('preferences.dataUsage.trackAppUsageStats', (newVal, oldVal) => {
    if (checkWhetherToStartSystem())
        global.dataUsageSystem.startSystem();
    else
        global.dataUsageSystem.stopSystem();
});

store.onDidChange('preferences.blockers.apps', (newVal, oldVal) => {
    if (checkWhetherToStartSystem())
        global.dataUsageSystem.startSystem();
    else
        global.dataUsageSystem.stopSystem();
});

function checkWhetherToStartSystem() {
    // Check if option to track app usage stats are on
    const trackAppUsageStats = global.store.get('preferences.dataUsage.trackAppUsageStats');

    // Check if any apps are set as blockers
    const appBlockers = global.store.get('preferences.blockers.apps');

    return trackAppUsageStats || (appBlockers.length != 0);
}


/**
 * These event handlers retrieve information about open windows on behalf of the renderer.
 */
// Get list of open windows
ipcMain.on('get-open-windows', async (event) => {
    event.returnValue = appSnapshotSystem.getLastSnapshot();
});