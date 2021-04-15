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
        let firstTime = true;
        let notZero = false;
        let minSC = 0; let maxSC = 0; let aveSC = 0;
        let minTC = 0; let maxTC = 0; let aveTC = 0;

        // Get Values
        let i = 0; let count = data.length;
        for (i = 0; i < count; i++) {

            let notZero = true;

            // Get one row data
            let row = JSON.parse(JSON.stringify(data[i]));
            let rST = row.screenTime; let rTC = row.timerCount;

            // Screen Time: Min/Max
            if (minSC > rST) { minSC = rST; }
            if (maxSC < rST) { maxSC = rST; }

            // Timer Count: Min/Max
            if (minTC > rTC) { minTC = rTC; }
            if (maxTC < rTC) { maxTC = rTC; }

            // Totals to calculate averages
            aveSC += rST;  aveTC += rTC;
        }

        // Averages
        if (notZero == true) {
            aveSC /= count; aveTC /= count;
        }
        
        return [aveSC, minSC, maxSC, aveTC, minTC, maxTC];
    }


}

//-------------

module.exports = api_methods;