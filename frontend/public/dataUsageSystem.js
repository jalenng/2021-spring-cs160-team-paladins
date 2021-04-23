const psShell = require('node-powershell');
const isWindows = process.platform == 'win32';

const APP_SNAPSHOT_INTERVAL = 5000
const POWERSHELL_GET_PROCESS_COMMAND = 
    `Get-Process | Where-Object {$_.mainWindowTitle} | Select-Object Name, mainWindowtitle, Description, Path | ConvertTo-Json | % {$_ -replace("\\u200B")} | % {$_ -replace("\\u200E")}`

/**
 * Data usage system states
 */
const states = {
    RUNNING: 'running',
    STOPPED:  'stopped',
}

var interval;

function dataUsageSystem() {

    this.state = states.STOPPED;
    this.ps = null;

    /**
     * Capture a snapshot of the list of open windows, 
     * then update the data usage store accordingly.
     */
    this.captureAppSnapshot = async function () {
        let openProcesses = await this.getOpenProcesses();

        // Update app usage
        let appUsage = global.store.get('dataUsage.unsynced.appUsage');
        openProcesses.forEach( taskName => {
            let newValue = (taskName in appUsage)
                ? appUsage[taskName] + APP_SNAPSHOT_INTERVAL
                : 0;
            appUsage[taskName] = newValue;
        })
        global.store.set('dataUsage.unsynced.appUsage', appUsage)

        console.log(appUsage)
    }

    /**
     * Get the list of open windows.
     * @returns {[string]} List of names of open windows
     */
    this.getOpenProcesses = async function() {
        let result = [];

        // WINDOWS: Invoke PowerShell command to get open windows
        if (isWindows) {
            try {
                // Evaluate the JSON string output to a JSON object
                this.ps.addCommand(POWERSHELL_GET_PROCESS_COMMAND);
                const psOutput = await this.ps.invoke();
                const psJson = eval(psOutput)

                // Perform processing to get the ideal name
                psJson.forEach( process => {
                    const winTitle = process.MainWindowTitle;
                    const winDesc = process.Description;
                    if (winTitle.indexOf(winDesc) === -1) 
                        result.push(winTitle);
                    else
                        result.push(winDesc);
                })

            }
            catch (error) { console.log(error) }
        }

        return result;
    }

    /**
     * Starts the data usage system.
     */
    this.startSystem = function () {
        if (this.state = states.STOPPED) {
            // Set interval to take snapshots of open processes
            interval = setInterval(this.captureAppSnapshot.bind(this), APP_SNAPSHOT_INTERVAL);
            
            // WINDOWS: Set up PowerShell shell
            if (isWindows) {
                this.ps = new psShell({
                    executionPolicy: 'Bypass',
                    noProfile: true
                });
            }
            
            this.state = states.RUNNING;            
        }
    }

    /**
     * Stops the data usage system.
     */
    this.stopSystem = function () {
        if (this.state = states.RUNNING)
            clearInterval(interval);
            this.state = states.STOPPED;
    }

}

// Instantiate the data usage system
global.dataUsageSystem = new dataUsageSystem();


// Start data usage system automatically based on user preference
if (global.store.get('preferences.dataUsage.trackAppUsageStats'))
    global.dataUsageSystem.startSystem();


// Update the status of the data usage system if the setting changes
store.onDidChange('preferences.dataUsage.trackAppUsageStats', (newVal, oldVal) => {
    if (newVal)
        global.dataUsageSystem.startSystem();
    else
        global.dataUsageSystem.stopSystem();
});