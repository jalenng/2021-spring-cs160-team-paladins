  class api_methods {
    constructor() {}

    /**
     * Gets the response values for a failed create user
     * @param {String} displayName
     * @param {String} password 
     * @returns array of reason and message
     */
    async postCreateUser(displayName, password) {
        let r = ""; let m = "";

        if (displayName === "") { r = "BAD_DISPLAY_NAME"; m = "Display name cannot be empty."; }
        else if (password.length < 8) { r = "BAD_PASS"; m = "Your password must be at least 8 characters long."; }
        else { r = "BAD_EMAIL"; m = "Email already in use."; }

        return [r, m];
    }

    /**
     * Gets statistical values from data usage records
     * @param {JSON} data records 
     * @returns [aveST, minST, maxSt, aveTC, minTC, maxTC]
     */
    async getStatistics(data) {
        // Screen Time, Timer Count - Min, Max, Average
        let minSC = "empty"; let maxSC = 0; let aveSC = 0;
        let minTC = "empty"; let maxTC = 0; let aveTC = 0;

        // Get Values
        let i = 0; let count = data.length;
        for (i = 0; i < count; i++) {
            // Get one row data
            let row = JSON.parse(JSON.stringify(data[i]));
            let rST = row.screenTime; let rTC = row.timerCount;

            // Screen Time: Min/Max
            if (minSC == "empty") { minSC = rST; } else if (minSC > rST) { minSC = rST; }
            if (maxSC < rST) { maxSC = rST; }

            // Timer Count: Min/Max
            if (minTC == "empty") { minTC = rTC; } else if (minTC > rTC) { minTC = rTC; }
            if (maxTC < rTC) { maxTC = rTC; }

            // Totals to calculate averages
            aveSC += rST;  aveTC += rTC;
        }

        // Averages
        aveSC /= count; aveTC /= count;
        return [aveScreenTime, minScreenTime, maxScreenTime, aveTimerCount, minTimerCount, maxTimerCount];
    }


}

//-------------

module.exports = api_methods;