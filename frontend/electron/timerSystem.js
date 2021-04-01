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

    this.on = function(name, listener) {

        if (!this._events[name]) {
          this._events[name] = [];
        }
    
        this._events[name].push(listener);
    }

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

    this.start = function() {

        if (this.state != timerStates.RUNNING) {
            this.setupTimes();
            console.log("Timer started");
        }

    };

    this.setupTimes = function() {
        this.endTime = new Date();
        this.endTime.setMilliseconds(this.endTime.getMilliseconds() + TIMER_DURATION);
        this.totalDuration = TIMER_DURATION;
        
        clearTimeout(timeout)
        timeout = setTimeout(this.end.bind(this), TIMER_DURATION);

        this.state = timerStates.RUNNING;
    }

    this.stop = function() {
        this.endTime = 0;
        clearTimeout(timeout);
        this.state = timerStates.STOPPED;

        console.log("Timer stopped");
    };

    this.end = function() {
        clearTimeout(timeout);

        const fireCallbacks = (callback) => callback();
        
        this.state = timerStates.RESTING;
        
        console.log("Timer ended");
        this._events['timer-end'].forEach(fireCallbacks);
    };

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