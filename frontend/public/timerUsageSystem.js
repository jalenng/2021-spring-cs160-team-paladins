
/**
 * data usage system states
 */
const states = {
    RUNNING: 'running',
    STOPPED:  'stopped',
}

var interval;

function timerUsageSystem() {

    this.state = states.STOPPED;

    /**
     * Get timer usage
     */

    this.getUsage = async function() {
        let timerUsage = global.store.get('dataUsage.unsynced.timerUsage');
        return timerUsage;
    } 

    /**
     * Capture a snapshot of the list of open windows, 
     * then update the app usage store accordingly.
     */
    this.captureAppSnapshot = async function () {
        let openProcesses = await this.getOpenProcesses();

        // Update app usage
        let appUsage = global.store.get('appUsage.unsynced.appUsage');
        openProcesses.forEach( process => {
            const processPath = process.path;

            // Try to find an entry with the same path
            const foundEntry = appUsage.find(app => app.appPath === processPath)

            // If this app has not been seen, add new entry
            if (foundEntry === undefined) {
                appUsage.push({
                    appName: process.name,
                    appPath: processPath,
                    appTime:  APP_SNAPSHOT_INTERVAL
                })
            }
            // Else, just update existing entry
            else {
                appUsage = appUsage.filter(app => app.appPath != processPath); // Remove existing entry
                appUsage.push({ // Push updated entry
                    appName: process.name,
                    appPath: processPath,
                    appTime: foundEntry.appTime + APP_SNAPSHOT_INTERVAL
                })
            }            
        })

        global.store.set('appUsage.unsynced.appUsage', appUsage)

        console.log(appUsage)
    }

    /**
     * Starts the app usage system.
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
     * Stops the app usage system.
     */
    this.stopSystem = function () {
        if (this.state = states.RUNNING)
            clearInterval(interval);
            this.state = states.STOPPED;
    }

}

// Instantiate the app usage system
global.timerUsageSystem = new timerUsageSystem();


// Start app usage system automatically based on user preference
if (global.store.get('preferences.appUsage.trackAppUsageStats'))
    global.timerUsageSystem.startSystem();

// Update the status of the app usage system if the setting changes
store.onDidChange('preferences.appUsage.trackAppUsageStats', (newVal, oldVal) => {
    if (newVal)
        global.timerUsageSystem.startSystem();
    else
        global.timerUsageSystem.stopSystem();
});