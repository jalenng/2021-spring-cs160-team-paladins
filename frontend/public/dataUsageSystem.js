const tasklist = require('tasklist');

/**
 * List of Windows standard processes to ignore
 */
const WINDOWS_STANDARD_PROCESSES = [
    'alg.exe', 'audiodg.exe', 'appvshnotify.exe', 'backgroundtaskhost', 'chsime.exe', 'cmd.exe', 'compkgserv.exe', 'conhost.exe', 'csrss.exe', 'ctfmon.exe', 'desktop.ini', 'dllhost.exe', 'dwm.exe', 'explorer.exe', 'filecoauth.exe', 'fontdrvhost.exe', 'hiberfil.sys', 'hxoutlook.exe', 'hxtsr.exe', 'igcc.exe', 'igcctray.exe', 'igfxemn.exe', 'internat.exe', 'ipoint.exe', 'itype.exe', 'kernel32.dll', 'locationnotificationwindows.exe', 'lockapp.exe', 'logonui.exe', 'lsass.exe', 'lsm.exe', 'mdm.exe', 'mobsync.exe', 'msmsgs.exe', 'mssearch.exe', 'mstask.exe', 'ntoskrnl.exe', 'pagefile.sys', 'penservice.exe', 'powershell.exe', 'regsvc.exe', 'rundll32.exe', 'runtimebroker.exe', 'sdclt.exe', 'searchapp.exe', 'services.exe', 'settingsynchost.exe', 'shellexperiencehost.exe', 'sihost.exe', 'slsvc.exe', 'slwinact.exe', 'smss.exe', 'spoolsv.exe', 'startmenuexperiencehost.exe', 'svchost.exe', 'system', 'systemsettingsbroker.exe', 'idle', 'tabtip.exe', 'taskeng.exe', 'taskhost.exe', 'taskhostex.exe', 'taskhostw.exe', 'tasklist.exe', 'textinputhost', 'thumbs.db', 'useroobebroker.exe', 'wercon.exe', 'wininit.exe', 'winlogon.exe', 'winmgmt.exe', 'wmiexe.exe', 'wmiprvse.exe', 'wpcumi.exe', 'wscntfy.exe', 'wuauclt.exe', 'wudfhost.exe'
]

const APP_SNAPSHOT_INTERVAL = 5000

/**
 * Data usage system states
 */
const states = {
    RUNNING: 'running',
    STOPPED:  'stopped',
}

var interval;

function dataUsageSystem() {

    this.state = states.STOPPED

    /**
     * Capture a snapshot of the list of open processes, 
     * then update the data usage store accordingly.
     */
    this.captureAppSnapshot = async function () {
        let openProcesses = await getOpenProcesses();
        let appUsage = global.store.get('dataUsage.unsynced.appUsage')

        // Update app usage
        openProcesses.forEach( taskName => {
            let newValue = (taskName in appUsage)
                ? appUsage[taskName] + APP_SNAPSHOT_INTERVAL
                : 0;
            appUsage[taskName] = newValue;
        })

        global.store.set('dataUsage.unsynced.appUsage', appUsage)
    }

    /**
     * Starts the data usage system.
     */
    this.startSystem = function () {
        if (this.state = states.STOPPED)
            interval = setInterval(this.captureAppSnapshot.bind(this), APP_SNAPSHOT_INTERVAL);
            this.state = states.RUNNING;
    }

    /**
     * Stops the data usage system.
     */
    this.stopSystem = function () {
        if (this.state = states.RUNNING)
            clearInterval(interval);
            this.state = states.STOPPED;
    }

}

/**
 * Gets a list of open processes on the client's computer
 * @returns {[String]} an array of processes open when the function is called
 */
async function getOpenProcesses() {
    let tasks = await tasklist();
        
    // Filter out services and standard processes
    let seenTaskImageName = [];
    let filteredTasks = tasks.filter( (task) => {
        // Check if service
        if (task.sessionName == 'Services') return false;

        // Check if it's a Windows standard process
        if (WINDOWS_STANDARD_PROCESSES.indexOf(task.imageName.toLowerCase()) != -1) return false;

        // Check if it's a duplicate
        if (seenTaskImageName.indexOf(task.imageName.toLowerCase()) != -1) return false; 

        seenTaskImageName.push(task.imageName.toLowerCase())
        return true;
    })

    return filteredTasks.map( (task) => {
        return task.imageName
    })
}

// Instantiate the data usage system
global.dataUsageSystem = new dataUsageSystem();


// Start data usage system automatically based on user preference
if (global.store.get('preferences.dataUsage.trackAppUsageStats'))
    global.dataUsageSystem.startSystem();

// Update the status of the data usage system if the setting changes
store.onDidChange('preferences.dataUsage.trackAppUsageStats', (newVal, oldVal) => {
    if (newVal)
        global.dataUsageSystem.startSystem();
    else
        global.dataUsageSystem.stopSystem();
});