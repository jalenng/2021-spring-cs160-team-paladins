const { ipcMain } = require('electron');
const { unstable_renderSubtreeIntoContainer } = require('react-dom');

/**
 * Timer states
 *
 * The states of the timers and its transitions are shown here:
 * 
 * 0 : false :: 1 : true
 * 
 *                 +-----------------------+--------------+
 *                 |               isPaused               |
 *                 +-----------------------+--------------+
 *                 |           0           |       1      |
 * +-----------+---+-----------------------+--------------+
 * |           |   | +-------------------+ |              |
 * |           |   | | isIdle            | |              |
 * |           |   | +-------------------+ |              |
 * |           |   | |    0    |    1    | |              |  /\          |
 * |           | 0 | +-------------------+ |    Paused    |  |           |
 * | isBlocked |   | | Running |  Idle   | |              |  |           |
 * |           |   | +-------------------+ |              |  |           | 
 * |           |   |    <----Start-----    |              |  | Unblock   | Block
 * |           |   |    ------End----->    |              |  |           |
 * |           +---+-----------------------+--------------+  |           |
 * |           |   |                       |    Blocked   |  |           |
 * |           | 1 |        Blocked        |      and     |  |           \/
 * |           |   |                       |    paused    |
 * +-----------+---+-----------------------+--------------+
 *                             <-------Start--------
 *                             --------Pause------->
 * 
 *                             <-------Toggle------>
 */
const states = {
    RUNNING: 'running',
    IDLE: 'idle',
    BLOCKED: 'blocked',
    PAUSED: 'paused',
    BLOCKED_AND_PAUSED: 'blocked_and_paused'
}

const TimerSystem = function(){

    this._events = {};

    this.timeout;

    this.isPaused = true;
    this.isBlocked = false;
    this.isIdle = false;

    this.endDate = new Date();  // When the timer will end
    this.totalDuration = global.store.get('preferences.notifications.interval') * 60000; // In milliseconds
    this.remainingTime = global.store.get('preferences.notifications.interval') * 60000; // In milliseconds

    /**
     * Registers an event listener
     */
    this.on = function(name, listener) {
        if (!this._events[name]) 
            this._events[name] = [];
        this._events[name].push(listener);
    }

    /**
     * Gets the status of the timer system
     * @returns an object
     */
    this.getStatus = function() {

        if (this.getState() === states.RUNNING) {
            this.remainingTime = this.endDate - new Date();
        }

        return {
            state: this.getState(),
            endDate: this.endDate,
            totalDuration: this.totalDuration,
            remainingTime: this.remainingTime,
        }
    };

    /**
     * Starts the timer. Calls this.setupTimer in the process.
     */
    this.start = function() {
        const state = this.getState()

        if (state === states.BLOCKED) return;
        if (state === states.RUNNING) return;

        if (state === states.IDLE) this.reset()
        
        this.setupTimes();

        // Update state bits
        this.isIdle = false;
        this.isPaused = false;
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
        // if (this.isPaused) return;
        if (this.isBlocked) return;
        if (this.isIdle) return;

        clearTimeout(this.timeout);

         // Call timer-end listeners
        const fireCallbacks = (callback) => callback();
        this._events['timer-end'].forEach(fireCallbacks);

        this.isIdle = true;
        this.isPaused = false;
    };

    /**
     * Pauses the timer. Saves the remaining time.
     */
    this.pause = function() {
        if (this.isPaused) return;

        this.remainingTime = this.endDate - new Date();
        clearTimeout(this.timeout)

        this.isPaused = true;
    }

    /**
     * Resets the timer
     */
    this.reset = function() {
        this.totalDuration = global.store.get('preferences.notifications.interval') * 60000;
        this.remainingTime = this.totalDuration

        if (this.getState() === states.RUNNING) this.setupTimes();
    }

    /**
     * Blocks the timer from running
     */
    this.block = function() {
        if (this.isIdle) return
        if (this.isBlocked) return

        const state = this.getState();
        if (state === states.BLOCKED || state === states.PAUSED) return;
        clearTimeout(this.timeout);

        this.totalDuration = global.store.get('preferences.notifications.interval') * 60000;
        this.remainingTime = this.totalDuration

        this.blocked = true;
    }

    /**
     * Pauses the timer if the timer is running 
     * or starts the timer when it is paused or blocked.
     */
    this.togglePause = function() {
        if (this.isPaused) 
            this.start();
        else 
            this.pause();
    }

    /**
     * Gets the state of the timer.
     * @returns a string indicating the state.
     */
    this.getState = function() {
        if (this.isPaused) {
            if (this.isBlocked)
                return states.BLOCKED_AND_PAUSED;
            else 
                return states.PAUSED;
        }
        else {
            if (this.isBlocked)
                return states.BLOCKED;
            else if (this.isIdle) 
                return states.IDLE;
            else 
                return states.RUNNING;
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