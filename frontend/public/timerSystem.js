const { ipcMain } = require('electron');

/**
 * Timer states
 */
const states = {
    BLOCKED: 'blocked',
    STOPPED: 'stopped',
    RUNNING: 'running',
    RESTING: 'resting',
}

var timeout;

const TimerSystem = function(){

    this._events = {};

    this.state = states.STOPPED;
    this.totalDuration = 0;
    this.endTime = new Date();

    /**
     * Registers an event listener
     */
    this.on = function(name, listener) {

        if (!this._events[name]) {
          this._events[name] = [];
        }
    
        this._events[name].push(listener);
    }

    /**
     * Gets the status of the timer system
     * @returns an object
     */
    this.getStatus = function() {
        let remainingTime;

        if (this.state === states.RUNNING)
            remainingTime = this.endTime - new Date()
        else 
            remainingTime = this.totalDuration;

        let timerStatus = {
            state: this.state,
            endTime: this.endTime,
            duration: this.totalDuration,
            remainingTime: remainingTime
        }

        return timerStatus;
    };

    /**
     * Starts the timer. Calls this.setupTimes in the process.
     */
    this.start = function() {
        if (this.state != states.RUNNING) {
            this.state = states.RUNNING;
            this.setupTimes();
        }
    };

    /**
     * Initializes the end time and timeout
     */
    this.setupTimes = function() {
        let timerDuration = global.store.get('preferences.notifications.interval') * 60000;
        
        this.endTime = new Date();
        this.endTime.setMilliseconds(this.endTime.getMilliseconds() + timerDuration);
        this.totalDuration = timerDuration;
        
        clearTimeout(timeout)
        timeout = setTimeout(this.end.bind(this), timerDuration);
    }

    /**
     * Stops the timer
     */
    this.stop = function() {
        this.endTime = 0;
        clearTimeout(timeout);
        this.state = states.STOPPED;
    };

    /**
     * Ends the timer and emits the 'timer-end' event.
     * This brings the timer state to RESTING to indicate a rest.
     */
    this.end = function() {
        clearTimeout(timeout);

         // Call timer-end listeners
        const fireCallbacks = (callback) => callback();
        this._events['timer-end'].forEach(fireCallbacks);
        
        this.state = states.RESTING;        
    };

    /**
     * Starts or stops the timer depending on its current state
     */
    this.toggle = function() {
        
        switch (this.state) {
            case states.RUNNING:
            case states.RESTING:
                this.stop();
                break;
            case states.STOPPED:
            case states.BLOCKED:
                this.start();
                break;
        }
        
    }

}


// Instantiate the timer system
global.timerSystem = new TimerSystem();

// Start timer automatically based on user preference
if (global.store.get('preferences.startup.startTimerOnAppStartup'))
    global.timerSystem.start();


/**
 * Timer-related IPC event handlers 
 * These event handlers retrieve and update the timer on behalf of the renderer.
 */

// Toggle timer
ipcMain.handle('timer-toggle', () => {
    global.timerSystem.toggle();
})

// Toggle timer
ipcMain.handle('timer-end', () => {
    global.timerSystem.end();
})

// Get timer status
ipcMain.on('get-timer-status', (event) => {
    event.reply('receive-timer-status', global.timerSystem.getStatus());
});


module.exports = {
    TimerStates: states
}