const timerStates = {

    BLOCKED: 'blocked',
    STOPPED: 'stopped',
    RUNNING: 'running',
    RESTING: 'resting',

}

const TIMER_DURATION = 1200000;

var timeout;

const timerSystem = function(){

    this.state = timerStates.STOPPED;
    this.totalDuration = 0;
    this.endTime = new Date();

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
            this.state = timerStates.RUNNING;
            this.endTime = new Date();
            this.endTime.setMilliseconds(this.endTime.getMilliseconds() + TIMER_DURATION);
            
            totalDuration = TIMER_DURATION;
            timeout = setTimeout(this.end.bind(this), TIMER_DURATION);
            console.log("Timer started");
        }

    };


    this.stop = function() {
        this.state = timerStates.STOPPED;
        this.endTime = 0;
        clearTimeout(timeout);
        console.log("Timer stopped");
    };

    this.end = function() {
        this.state = timerStates.RESTING;
        console.log("Timer ended");
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
