const { powerMonitor, ipcMain } = require('electron');

function BlockerSystem() {

    this._events = {};

    this.blockers = [];

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
     * Adds a blocker to the list of blockers
     * @param {Object} blocker 
     */
    this.add = function (blocker) {
        this.blockers.push(blocker);

        // Call blocker-detected listeners
        const fireCallbacks = (callback) => callback();
        this._events['blocker-detected'].forEach(fireCallbacks);
    }

    /**
     * Clears the list of blockers
     */
    this.clear = function () {
        this.blockers = [];

        // Call blockers-cleared listeners
        const fireCallbacks = (callback) => callback();
        this._events['blockers-cleared'].forEach(fireCallbacks);
    }

    /**
     * Update the data usage store according to the list of open processes
     */
    this.processAppSnapshot = async function (openProcesses) {
        let appBlockers = global.store.get('preferences.blockers.apps')

        // Update app usage
        openProcesses.forEach(process => {
            const processPath = process.path;

            if (appBlockers.indexOf(processPath) != -1) {
                this.add({
                    type: 'App',
                    message: process.name
                })
            }
        })
    }

}

// Instantiate the blocker system
global.blockerSystem = new BlockerSystem();

// Block if switched to battery power
powerMonitor.on('on-battery', () => {
    if (global.store.get('preferences.blockers.blockOnBattery')) 
        blockerSystem.add({
            type: 'Other',
            message: 'Your computer is running on battery power.'
        });
});

ipcMain.handle('clear-blockers', () => {
    global.blockerSystem.clear();
})