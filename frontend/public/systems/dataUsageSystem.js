/*
The data usage system handles the aggregation of app-related and timer-related information.

The states of the data usage system are as follows:
    - isRunning
        - true <---> false
*/

module.exports = function() {

    this.isRunning = false;
    
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
        if (!this.isRunning) this.isRunning = true;    
    }

    /**
     * Stops the data usage system.
     */
    this.stopSystem = function () {
        if (this.isRunning) this.isRunning = false;
    }

    /**
     * Starts or stops the data usage system depending on user preferences
     */
    this.updateState = function () {
        if (global.store.get('preferences.dataUsage.trackAppUsageStats')) 
            this.startSystem();
        else
            this.stopSystem();
    }
}