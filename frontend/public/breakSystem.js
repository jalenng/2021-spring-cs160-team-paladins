const { ipcMain, screen } = require('electron');
const soundPlayer = require('sound-play');
const path = require('path'); 

/**
 * Break states
 */
const states = {
    ON_BREAK: 'on_break',
    NOT_ON_BREAK: 'not_on_break',
}

const BREAK_DURATION = 20000;

var oldMousePos;
var checkMousePositionInterval;

var timeout;

const BreakSystem = function(){

    this._events = {};

    this.state = states.NOT_ON_BREAK;
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
     * Gets the status of the break system
     * @returns an object
     */
    this.getStatus = function() {
        var remainingTime;

        if (this.state === states.ON_BREAK)
            remainingTime = this.endTime - new Date()
        else 
            remainingTime = this.totalDuration;

        var breakStatus = {
            state: this.state,
            endTime: this.endTime,
            duration: this.totalDuration,
            remainingTime: remainingTime
        }

        return breakStatus;
    };

    /**
     * Starts the break. Calls this.setupTimes in the process.
     */
    this.start = function() {

        if (this.state != states.ON_BREAK) {

            this.state = states.ON_BREAK;

            if (global.store.get('preferences.notifications.enableSound') === true) 
                this.playSound();

            this.setupTimes();
                        
            // Set interval to continuously check mouse position
            oldMousePos = screen.getCursorScreenPoint();
            checkMousePositionInterval = setInterval(() => {
                var newMousePos = screen.getCursorScreenPoint();
                var mouseMoved = newMousePos.x != oldMousePos.x || newMousePos.y != oldMousePos.y;

                if (mouseMoved) {
                    this.setupTimes();
                    oldMousePos = newMousePos;
                }

            }, 100);            
            
        }
        
    }
    
    /**
     * Initializes the end time and timeout
     */
    this.setupTimes = function() {
        this.endTime = new Date();
        this.endTime.setMilliseconds(this.endTime.getMilliseconds() + BREAK_DURATION);
        
        this.totalDuration = BREAK_DURATION;
        
        clearTimeout(timeout)
        timeout = setTimeout(this.end.bind(this), BREAK_DURATION);
    }

    /**
     * Ends the break and emits the 'break-end' event
     */
    this.end = function() {

        if (this.state != states.NOT_ON_BREAK) {

            if (global.store.get('preferences.notifications.enableSound') === true) 
                this.playSound();

            clearTimeout(timeout)
            clearInterval(checkMousePositionInterval)

            // Call break-end listeners
            const fireCallbacks = (callback) => callback();
            this._events['break-end'].forEach(fireCallbacks);

            this.state = states.NOT_ON_BREAK; 
        }

    }

    /**
     * Plays the sound stored in the store under preferences.notifications.sound
     */
    this.playSound = function() {
        let soundKey = global.store.get('preferences.notifications.sound');

        let fullFilepath = path.isAbsolute(soundKey)
            ? soundKey
            : path.join(__dirname, soundKey);
        soundPlayer.play(fullFilepath);
    }
}


// Instantiate the break system
global.breakSystem = new BreakSystem();


/**
 * Break-related IPC event handlers 
 * These event handlers retrieve and update the break system on behalf of the renderer.
 */
// Get break status
ipcMain.on('get-break-status', (event) => {
    event.reply('receive-break-status', global.breakSystem.getStatus());
});


module.exports = {
    BreakStates: states
}