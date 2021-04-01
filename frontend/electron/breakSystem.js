const { BrowserWindow, screen } = require('electron');
const isDev = require('electron-is-dev'); 
const path = require('path'); 

const breakStates = {

    ON_BREAK: 'on_break',
    NOT_ON_BREAK: 'not_on_break',

}

const BREAK_DURATION = 10000;

var oldMousePos;

var checkMousePositionInterval;
var timeout;

global.fsWindows;

const breakSystem = function(){

    this._events = {};

    this.state = breakStates.NOT_ON_BREAK;
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

        if (this.state === breakStates.ON_BREAK)
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

    this.start = function() {

        if (this.state != breakStates.ON_BREAK) {
            this.state = breakStates.ON_BREAK;

            this.setupTimes();

            oldMousePos = screen.getCursorScreenPoint();
            checkMousePositionInterval = setInterval(() => {
                var newMousePos = screen.getCursorScreenPoint();
                var mouseMoved = newMousePos.x != oldMousePos.x || newMousePos.y != oldMousePos.y;

                if (mouseMoved) {
                    this.setupTimes();
                    oldMousePos = newMousePos;
                }

            }, 100);

            notifyFullscreen();

            console.log("Break started");
        }
        
    }
    
    this.setupTimes = function() {
        this.endTime = new Date();
        this.endTime.setMilliseconds(this.endTime.getMilliseconds() + BREAK_DURATION);
        
        this.totalDuration = BREAK_DURATION;
        
        clearTimeout(timeout)
        timeout = setTimeout(this.end.bind(this), BREAK_DURATION);
    }

    this.end = function() {

        if (this.state != breakStates.NOT_ON_BREAK) {

            clearTimeout(timeout)
            clearInterval(checkMousePositionInterval)

            for (var i = 0; i < global.fsWindows.length; i++) {
                global.fsWindows[i].removeAllListeners('close');
                global.fsWindows[i].close();
            }
            
            this.state = breakStates.NOT_ON_BREAK;          

            const fireCallbacks = (callback) => callback();

            console.log("Break ended")

            this._events['break-end'].forEach(fireCallbacks);
        }

    }
}


// Fullscreen notification windows
function notifyFullscreen() {
    const disps = screen.getAllDisplays();

    global.fsWindows = [];

    for (var i = 0; i < disps.length; i++) {
        global.fsWindows.push(createFullscreenWindow(disps[i].bounds));
    }

}

function createFullscreenWindow(bounds) {

    var fsWin = new BrowserWindow({
        alwaysOnTop: true,
        focusable: false,
        width: 800,
        height: 500,
        resizable: false,
        movable: false,
        frame: false,
        parent: global.mainWindow,
        minimizable: false,
        maximizable: false,
        skipTaskbar: true,
        show: false,
        title: "iCare Overlay",
        backgroundColor: '#333333',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    fsWin.menuBarVisible = false;
    
    fsWin.setBounds(bounds);

    fsWin.on('close', (e) => e.preventDefault())

    fsWin.loadURL(
        isDev
        ? 'http://localhost:3000/notification/fullscreen'
        : `file://${path.join(__dirname, '../build/login/index.html')}`
    ); 

    fsWin.on('ready-to-show', () => {
        fsWin.show();
    })

    return fsWin;

}


module.exports = {
    BreakSystem: breakSystem
}