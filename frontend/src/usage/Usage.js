import { resultContent } from "@fluentui/react/lib/components/FloatingPicker/PeoplePicker/PeoplePicker.scss";

// Gets data usage 
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default class Usage {

  constructor() {


    // Gets current date
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = ("00" + (this.date.getMonth() + 1)).substr(-2, 2);
    this.day = ("00" + this.date.getDate()).substr(-2, 2);
    this.weekday = weekdays[this.date.getDay()];
    // Format: YEAR-MONTH-DAY  
    // ex. '2021-05-07'
    this.todayFormatted =  `${this.year}-${this.month}-${this.day}`;
    // Get data usage values.
    this.state = store.dataUsage.getAll();
  }
  
  // Gets usage for the specified date from given list of objects.
  // Returns the data usage for specified date from given usage list. 
  getUsage(dateFormatted, usageList) {
    // will remove when db stops storing values with attached string.
    let todaysDate = dateFormatted + 'T00:00:00.000Z';
    var i;
    let usageObj = [];
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
}
