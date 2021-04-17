const { ThemeSettingName } = require('@fluentui/style-utilities');
const { ipcMain } = require('electron');

/**
 * Timer states
 */
const states = {
    RUNNING: 'Running',
    PAUSED:  'Paused',
    BREAK_TIME: 'Break Time',
}

var timeout;

const TimerSystem = function(){

    this._events = {};

    this.state = states.PAUSED;

    this.endDate = new Date();
    this.remainingTime = 0;

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
            remainingTime: this.remainingTime,
        }
    };

    /**
     * Starts the timer. Calls this.setupTimer in the process.
     */
    this.start = function() {
        if (this.state != states.RUNNING) {
            this.state = states.RUNNING;
            this.setupTimer();
        }
    };

    /**
     * Initializes the timer.
     * Also used for reset.
     */
    this.setupTimer = function() {
        if (this.state !== states.BREAK_TIME) {
            this.remainingTime = global.store.get('preferences.notifications.interval') * 60000;
            this.updateTimer();
        }
    }

    /**
     * Updates the timer.
     * 
     * Triggers when 
     *  1. starting timer after pausing.
     *  2. timer is initialized.
     *  
     */
    this.updateTimer = function() {
        this.endDate = new Date();
        let ms_left = this.endDate.getMilliseconds() + this.remainingTime;
        this.endDate.setMilliseconds(ms_left);
        clearTimeout(timeout)
        timeout = setTimeout(this.end.bind(this), this.remainingTime);
    }

    /**
     * Ends the timer and emits the 'timer-end' event.
     */
    this.end = function() {
        if (this.state === states.BREAK_TIME) {
            return;
        }
        clearTimeout(timeout);

         // Call timer-end listeners
        const fireCallbacks = (callback) => callback();
        this._events['timer-end'].forEach(fireCallbacks);
        this.state = states.BREAK_TIME;        
    };

    this.togglePause = function() {
        if (this.state === states.PAUSED) {
            this.state = states.RUNNING;
            this.updateTimer();
        } 
        else if (this.state === states.RUNNING) {
            this.state = states.PAUSED;
            this.remainingTime = this.endDate - new Date();
            clearTimeout(timeout)
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
ipcMain.handle('timer-reset', () => {
    global.timerSystem.setupTimer();
})

// Toggle timer
ipcMain.handle('timer-end', () => {
    global.timerSystem.end();
})

// Get timer status
ipcMain.on('get-timer-status', (event) => {
    event.reply('receive-timer-status', global.timerSystem.getStatus());
});

// Toggle pause/play
ipcMain.handle('pause-toggle', () => {
    global.timerSystem.togglePause();
})


module.exports = {
    TimerStates: states
}