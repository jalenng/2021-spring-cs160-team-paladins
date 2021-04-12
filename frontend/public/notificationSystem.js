
const { BrowserWindow, screen } = require('electron');
const path = require('path'); 
const isDev = require('electron-is-dev'); 

// Shared notification window options
const sharedWindowOptions = {
    alwaysOnTop: true,
    focusable: false,
    resizable: false,
    movable: false,
    frame: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    show: false,
    backgroundColor: '#222222',
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
    }
};

const POPUP_SIZE = {
    width: 360,
    height: 90
}

const NotificationSystem = function() {

    this.fullscreenWindows = [];
    this.popupWindows = [];

    /**
     * Creates notification windows
     */
    this.createWindows = function() {
        // Get displays and create notification windows
        const displays = screen.getAllDisplays();
        // displays.map(this.createFullscreenWindow.bind(this));
        displays.map(this.createPopupWindow.bind(this));    
    }

    /**
     * Closes all the notification windows
     */
    this.closeWindows = function() {
        this.fullscreenWindows.map(this.closeNotificationWindow);
        this.popupWindows.map(this.closeNotificationWindow);
    }

    /**
     * Pushes a fullscreen notification window
     * @param {Display} display the display to bound the window to
     */
    this.createFullscreenWindow = function(display) {

        const window = new BrowserWindow({
            ...sharedWindowOptions,
            parent: global.mainWindow,
            title: "iCare Notification",
        })

        window.menuBarVisible = false;
        
        const bounds = display.bounds;
        const screenRect = screen.dipToScreenRect(null, bounds);
        newBounds = {
            ...screenRect,
            width: bounds.width,
            height: bounds.height
        }
        window.setBounds(newBounds);

        window.on('close', (e) => e.preventDefault())

        window.loadURL(
            isDev
            ? 'http://localhost:3000#/fullscreenNotification'
            : `file://${path.join(__dirname, '../build/index.html#fullscreenNotification')}`
        ); 

        window.on('ready-to-show', () => {
            window.show();
        })

        this.fullscreenWindows.push(window);

    }

    /**
     * Pushes a popup notification window
     * @param {Display} display the display to bound the window to
     */
    this.createPopupWindow = function(display) {

        const window = new BrowserWindow({
            ...sharedWindowOptions,
            parent: global.mainWindow,
            title: "iCare Notification",
        })

        window.menuBarVisible = false;
        
        const displayScaling = display.scaleFactor;
        const workArea = display.workArea;
        const screenRect = screen.dipToScreenRect(null, workArea);
        newBounds = {
            x: screenRect.x + screenRect.width - (POPUP_SIZE.width * displayScaling),
            y: screenRect.y + screenRect.height - (POPUP_SIZE.height * displayScaling),
            width: POPUP_SIZE.width,
            height: POPUP_SIZE.height
        }
        window.setBounds(newBounds);

        window.on('close', (e) => e.preventDefault())

        window.loadURL(
            isDev
            ? 'http://localhost:3000#/popupNotification'
            : `file://${path.join(__dirname, '../build/index.html#popupNotification')}`
        ); 

        window.on('ready-to-show', () => {
            window.show();
        })

        this.popupWindows.push(window);

    }

    /**
     * Closes a notification window
     * @param {BrowserWindow} window 
     */
    this.closeNotificationWindow = function(window) {
        window.removeAllListeners('close');
        window.close();
    }

}


// Instantiate the break system
global.notificationSystem = new NotificationSystem();