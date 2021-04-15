const { ThemeSettingName } = require('@fluentui/style-utilities');
const { ipcMain } = require('electron');

/**
 * Timer states
 */
const states = {
    BLOCKED: 'blocked',
    STOPPED: 'stopped',
    RUNNING: 'running',
    RESTING: 'resting',
    PAUSED:  'paused',
}

var timeout;

const TimerSystem = function(){

    this._events = {};

    this.state = states.STOPPED;

    this.totalDuration = 0;
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
        else if (this.state === states.STOPPED) {
            this.remainingTime = this.totalDuration;
        }

        let timerStatus = {
            state: this.state,
            totalDuration: this.totalDuration,
            remainingTime: this.remainingTime,
        }

        console.log('Remaining time ' + this.remainingTime/1000);
        // console.log('Total time ' + this.totalDuration);
        // console.log();
        // console.log('End time ' + this.endDate);
        // console.log();

        return timerStatus;
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
     */
    this.setupTimer = function() {
        this.totalDuration = global.store.get('preferences.notifications.interval') * 60000;
        this.remainingTime = this.totalDuration;
        this.updateTimer();
    }

    /**
     * Updates the timer.
     * Called when timer started after a pause & also when timer initialized.
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

    this.togglePause = function() {
        // if started after pausing, update the endTime & remainingTime.
        if (this.state === states.PAUSED) {
            this.endDate = new Date();
            let ms_left = this.endDate.getMilliseconds() + this.remainingTime;
            this.endDate.setMilliseconds(ms_left);
            this.state = states.RUNNING;

            clearTimeout(timeout)
            timeout = setTimeout(this.end.bind(this), this.remainingTime);
        } 
        else if (this.state === states.RUNNING) {
            this.remainingTime = this.endDate - new Date();
            this.state = states.PAUSED;

        }

        // clearTimeout(timeout)
        // let timerDuration = global.store.get('preferences.notifications.interval') * 60000;
        // timeout = setTimeout(this.end.bind(this), timerDuration);
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