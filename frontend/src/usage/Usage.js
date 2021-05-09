// Gets data usage 
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default class Usage {

  constructor() {

    // Get current date
    this.date = new Date();
    this.weekday = weekdays[this.date.getDay()];

    // Format: YEAR-MONTH-DAY  
    // ex. '2021-05-07'
    this.todayFormatted = this.getFormatted(this.date);

    // Get data usage values.
    this.state = store.dataUsage.getAll();

    // 
  }


  getFormatted(theDate) {
    var year = theDate.getFullYear();
    var month = ("00" + (theDate.getMonth() + 1)).substr(-2, 2);
    var day = ("00" + theDate.getDate()).substr(-2, 2);
    return  `${year}-${month}-${day}`;
  }
  
  // Gets usage for the specified date from given list of objects.
  // Returns the data usage for specified date from given usage list. 
  getUsage(usageList, dateFormatted, ) {
    // will remove when db stops storing values with attached string.
    var todaysDate = dateFormatted + 'T00:00:00.000Z';
    var i;
    var usageObj = [];
    for (i=0; i<usageList.length; i++) {
      usageObj = usageList[i];
      if (usageObj.usageDate === todaysDate) {
        return usageObj;
      }
    }

    return {
        appUsage: [],
        timerUsage: []
    }
  }

  // Gets the past week's 
  //  1. Date objects (ex. 'Sun May 02 2021 01:48:55 GMT-0700 (Pacific Daylight Time)') 
  //  2. Names (ex. 'Sunday', 'Monday', etc)
  //  3. Formatted Dates ('2021-05-02')
  getPastWeek() {
    var dates, names, formatted = [];
    var dates = [];
    var names = [];
    var formatted = [];
    var i;
    for (i = weekdays.length-1; i >= 0; i--) {
      let day = new Date();
      day.setDate(this.date.getDate() - i);
      dates.push(day); 
      names.push(weekdays[day.getDay()]);
      formatted.push(this.getFormatted(day));
    }

    return {
      dates: dates,
      names: names,
      formatted: formatted,
    }
  }
}


