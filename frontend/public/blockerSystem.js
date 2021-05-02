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
     * Update the data usage store according to the list of open processes
     */
    this.processAppSnapshot = async function (openProcesses) {

        let blockerDetected = false;
        let appBlockers = global.store.get('preferences.blockers.apps')

        // Update app usage
        openProcesses.forEach( process => {
            const processPath = process.path;

            if (appBlockers.indexOf(processPath) != -1) {
                this.blockers.push({
                    type: 'App',
                    name: process.name
                })
                blockerDetected = true;
            }
        })

        if (blockerDetected) {
        // Call blocker-detected listeners
            const fireCallbacks = (callback) => callback();
            this._events['blocker-detected'].forEach(fireCallbacks);
        }

    }

    this.clear = function() {
        this.blockers = [];
    }

}

// Instantiate the data usage system
global.blockerSystem = new BlockerSystem();