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
    
    /**
     * Update the data usage store according to the list of open processes
     */
    this.processAppSnapshot = async function (openProcesses) {
        const appNamesDict  = global.store.get('appNames');

        // Update app usage
        let appUsage = global.store.get('dataUsage.unsynced.appUsage');
        openProcesses.forEach( process => {
            const processPath = process.path;

            // Try to find an entry with the same path
            const foundEntry = appUsage.find(app => app.appPath === processPath)

            // If this app has not been seen, add new entry
            if (foundEntry === undefined) {
                appUsage.push({
                    appName: appNamesDict[processPath],
                    appPath: processPath,
                    appTime: process.duration
                })
            }
            // Else, just update existing entry
            else {
                appUsage = appUsage.filter(app => app.appPath != processPath); // Remove existing entry
                appUsage.push({ // Push updated entry
                    appName: appNamesDict[processPath],
                    appPath: processPath,
                    appTime: foundEntry.appTime + process.duration
                })
            }            
        })

        global.store.set('dataUsage.unsynced.appUsage', appUsage)
    }

    /**
     * Starts the data usage system.
     */
    this.startSystem = function () {
        if (this.state = states.STOPPED)   
            this.state = states.RUNNING;            
    }

    /**
     * Stops the data usage system.
     */
    this.stopSystem = function () {
        if (this.state = states.RUNNING)
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