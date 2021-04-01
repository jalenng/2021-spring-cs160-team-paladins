/**
 * Timer states
 */
const timerStates = {

    BLOCKED: 'blocked',
    STOPPED: 'stopped',
    RUNNING: 'running',
    RESTING: 'resting',

}

const TIMER_DURATION = 10000;

var timeout;

const timerSystem = function(){

    this._events = {};

    this.state = timerStates.STOPPED;
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
        var remainingTime;

        if (this.state === timerStates.RUNNING)
            remainingTime = this.endTime - new Date()
        else 
            remainingTime = this.totalDuration;

        var timerStatus = {
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

        if (this.state != timerStates.RUNNING) {
            this.setupTimes();
            console.log("Timer started");
        }

    };

    /**
     * Initializes the end time and timeout
     */
    this.setupTimes = function() {
        this.endTime = new Date();
        this.endTime.setMilliseconds(this.endTime.getMilliseconds() + TIMER_DURATION);
        this.totalDuration = TIMER_DURATION;
        
        clearTimeout(timeout)
        timeout = setTimeout(this.end.bind(this), TIMER_DURATION);

        this.state = timerStates.RUNNING;
    }

    /**
     * Stops the timer
     */
    this.stop = function() {
        this.endTime = 0;
        clearTimeout(timeout);
        this.state = timerStates.STOPPED;

        console.log("Timer stopped");
    };

    /**
     * Ends the timer and emits the 'timer-end' event.
     * This brings the timer state to RESTING to indicate a rest.
     */
    this.end = function() {
        clearTimeout(timeout);

        const fireCallbacks = (callback) => callback();
        
        this.state = timerStates.RESTING;
        
        console.log("Timer ended");
        this._events['timer-end'].forEach(fireCallbacks);
    };

    /**
     * Starts or stops the timer depending on its current state
     */
    this.toggle = function() {
        
        switch (this.state) {
            case timerStates.RUNNING:
            case timerStates.RESTING:
                this.stop();
                break;
            case timerStates.STOPPED:
            case timerStates.BLOCKED:
                this.start();
                break;
        }
        
    }

}

module.exports = {
    TimerSystem: timerSystem,
    timerStates: timerStates
}