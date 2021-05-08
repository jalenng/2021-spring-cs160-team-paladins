import { resultContent } from "@fluentui/react/lib/components/FloatingPicker/PeoplePicker/PeoplePicker.scss";

// Gets data usage 
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default class Usage {

  constructor() {

    this.date = new Date();

    // Gets current date
    this.year = this.date.getFullYear();
    this.month = ("00" + (this.date.getMonth() + 1)).substr(-2, 2);
    this.day = ("00" + this.date.getDate()).substr(-2, 2);
    this.weekday = weekdays[this.date.getDay()];

    // Format: YEAR-MONTH-DAY  
    // ex. '2021-05-07'
    this.todayFormatted =  `${this.year}-${this.month}-${this.day}`;

    // Get data usage values.
    this.state = store.dataUsage.getAll();
    this.fetched = this.state.fetched;
    this.unsynced = this.state.unsynced;
  }
  
  // 
  getDailyUsage(usageList) {
    // will remove when db stops storing values with attached string.
    let todaysDate = this.todayFormatted + 'T00:00:00.000Z';
    
    var i;
    for (i=0; i<usageList.length; i++) {
      let theDate = usageList[i].usageDate;
      if (theDate === todaysDate) {
        return usageList[i];
      }
    }

    return {
        appUsage: [],
        timerUsage: []
    }
  }

  
}
