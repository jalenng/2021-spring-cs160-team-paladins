const { ipcMain } = require('electron');

/**
 * Timer states
 */
const states = {
    BLOCKED: 'blocked',
    PAUSED:  'paused',
    RUNNING: 'running',
    IDLE: 'idle'
}

const TimerSystem = function(){

    this._events = {};

    this.timeout;
    this.state = states.PAUSED;
    this.endDate = new Date();  // When the timer will end
    this.totalDuration = global.store.get('preferences.notifications.interval') * 60000; // In milliseconds
    this.remainingTime = global.store.get('preferences.notifications.interval') * 60000; // In milliseconds

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

        if (this.state === states.RUNNING) {
            this.remainingTime = this.endDate - new Date();
        }

        return {
            state: this.state,
            endDate: this.endDate,
            totalDuration: this.totalDuration,
            remainingTime: this.remainingTime,
        }
    };

    /**
     * Starts the timer. Calls this.setupTimer in the process.
     */
    this.start = function() {
        if (this.state === states.RUNNING) return;
        if (this.state === states.BLOCKED) this.state = states.IDLE;
        if (this.state === states.IDLE) this.reset();

        this.setupTimes();

        this.state = states.RUNNING;
    };

    /**
     * Sets up the timer times
     */
    this.setupTimes = function() {

        // Use JS timeouts to facilitate delay
        clearTimeout(this.timeout)
        this.timeout = setTimeout(this.end.bind(this), this.remainingTime);
        
        // Calculate the end date, 
        this.endDate = new Date();
        let msLeft = this.endDate.getMilliseconds() + this.remainingTime;
        this.endDate.setMilliseconds(msLeft);

    }

    /** 
     * Ends the timer and emits the 'timer-end' event. Used to start the break.
     */
    this.end = function() {
        
        if (this.state === states.BLOCKED) return;
        if (this.state === states.IDLE) return;

        clearTimeout(this.timeout);

         // Call timer-end listeners
        const fireCallbacks = (callback) => callback();
        this._events['timer-end'].forEach(fireCallbacks);

        this.state = states.IDLE;        
    };

    /**
     * Pauses the timer. Saves the remaining time.
     */
    this.pause = function() {
        if (this.state === states.BLOCKED) return;
        if (this.state === states.PAUSED) return;

        this.remainingTime = this.endDate - new Date();
        clearTimeout(this.timeout)

        this.state = states.PAUSED;
    }

    /**
     * Resets the timer
     */
    this.reset = function() {
        if (this.state === states.BLOCKED) return;

        this.totalDuration = global.store.get('preferences.notifications.interval') * 60000;
        this.remainingTime = this.totalDuration

        if (this.state === states.RUNNING) this.setupTimes();
    }

    /**
     * Blocks the timer from running
     */
    this.block = function() {
        if (this.state === states.BLOCKED || this.state === states.PAUSED) return;
        clearTimeout(this.timeout);

        this.totalDuration = global.store.get('preferences.notifications.interval') * 60000;
        this.remainingTime = this.totalDuration

        this.state = states.BLOCKED;
    }

    /**
     * Pauses the timer if the timer is running 
     * or starts the timer when it is paused or blocked.
     */
    this.togglePause = function() {
        if (this.state !== states.RUNNING) 
            this.start();
        else 
            this.pause();
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

// Reset the timer
ipcMain.handle('timer-reset', () => {
    global.timerSystem.reset();
})

// End the timer (and start the break)
ipcMain.handle('timer-end', () => {
    global.timerSystem.end();
})

// Get timer status
ipcMain.on('get-timer-status', (event) => {
    event.reply('receive-timer-status', global.timerSystem.getStatus());
});

// Toggle pause/play
ipcMain.handle('timer-toggle', () => {
    global.timerSystem.togglePause();
})

// Block the timer from running
ipcMain.handle('timer-block', () => {
    global.timerSystem.block();
})


module.exports = {
    TimerStates: states
}