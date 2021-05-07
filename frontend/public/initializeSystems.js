const { ipcMain, powerMonitor } = require('electron');

const TimerSystem = require('./systems/timerSystem');
const BreakSystem = require('./systems/breakSystem');
const NotificationSystem = require('./systems/notificationSystem');
const AppSnapshotSystem = require('./systems/appSnapshotSystem');
const DataUsageSystem = require('./systems/dataUsageSystem');
const BlockerSystem = require('./systems/blockerSystem');


// Instantiate the systems
global.timerSystem = new TimerSystem();
global.breakSystem = new BreakSystem();
global.notificationSystem = new NotificationSystem();
global.appSnapshotSystem = new AppSnapshotSystem();
global.dataUsageSystem = new DataUsageSystem();
global.blockerSystem = new BlockerSystem();


/*---------------------------------------------------------------------------*/
/* Start timer automatically based on user preferences */

if (global.store.get('preferences.startup.startTimerOnAppStartup'))
    global.timerSystem.start();


/*---------------------------------------------------------------------------*/
/* Update data usage systems based on user preferences */

global.dataUsageSystem.updateState();

// Update the status of the data usage system if the setting changes
store.onDidChange('preferences.dataUsage.trackAppUsageStats', () => {
    global.dataUsageSystem.updateState();
});


/*---------------------------------------------------------------------------*/
/* Update app snapshot systems based on user preferences */

global.appSnapshotSystem.updateState();

store.onDidChange('preferences.dataUsage.trackAppUsageStats', () => {
    global.appSnapshotSystem.updateState();
});

store.onDidChange('preferences.blockers.apps', () => {
    global.appSnapshotSystem.updateState();
});


/*---------------------------------------------------------------------------*/
/* Update blockers when the power state updates */

// Add a blocker if switched to battery power
powerMonitor.on('on-battery', () => {
    if (global.store.get('preferences.blockers.blockOnBattery')) 
        blockerSystem.add({
            type: 'other',
            key: 'batteryPower',
            message: 'Your computer is running on battery power.'
        });
});

// Remove the blocker if switched to AC power
powerMonitor.on('on-ac', () => {
    if (global.store.get('preferences.blockers.blockOnBattery')) 
        blockerSystem.remove('other', 'batteryPower');
});


/*---------------------------------------------------------------------------*/
/* Configure event listeners and connect the various systems */

// Start break when timer ends
timerSystem.on('timer-end', () => breakSystem.start()); 

// Create notification windows when break starts
breakSystem.on('break-start', () => notificationSystem.createWindows());  

// Minimize notification when the break time is set/reset
breakSystem.on('break-times-set', () => notificationSystem.minimize()); 

// Expand notification when the break time is past the intermediate point
breakSystem.on('break-intermediate', () => notificationSystem.maximize());

// Close notification windows when break ends
breakSystem.on('break-end', () => notificationSystem.closeWindows());

// Start timer when break ends
breakSystem.on('break-end', () => timerSystem.start());

// Process the list of open apps through the data usage system when a snapshot is taken
appSnapshotSystem.on('app-snapshot-taken', (snapshot) => dataUsageSystem.processAppSnapshot(snapshot));

// Process the list of open apps through the blocker system when a snapshot is taken
appSnapshotSystem.on('app-snapshot-taken', (snapshot) => blockerSystem.processAppSnapshot(snapshot));

// Block the timer when a blocker is detected
blockerSystem.on('blocker-detected', () => timerSystem.block());

// Unblock the timer when all blockers are cleared
blockerSystem.on('blockers-cleared', () => timerSystem.unblock());


/*---------------------------------------------------------------------------*/
/* IPC event handlers */

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

// Get break status
ipcMain.on('get-break-status', (event) => {
    event.reply('receive-break-status', global.breakSystem.getStatus());
});

// Play sound file
ipcMain.handle('play-sound', () => {
    global.breakSystem.playSound();
});

// Get list of open windows
ipcMain.on('get-open-windows', async (event) => {
    event.returnValue = appSnapshotSystem.getLastSnapshot();
});

// Get timer status
ipcMain.on('get-blockers', (event) => {
    event.reply('receive-blockers', global.blockerSystem.getBlockers());
});

// Clear blockers
ipcMain.handle('clear-blockers', () => {
    global.blockerSystem.clear();
})