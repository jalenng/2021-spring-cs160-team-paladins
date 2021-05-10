import React from "react";
import { Bar, defaults } from "react-chartjs-2"

defaults.global.tooltips.enabled = true;

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default class BarChart extends React.Component {

  constructor(props) {
    super(props);

    this.appUsage = store.dataUsage.getAll().fetched.appUsage;
    this.weeklyUsage = this.getPastWeek();
    this.backgroundColor = [];

    // Get apps names & usage from unsynced.
    this.labels = [];
    this.usage = [];
    for (var i=0; i < this.appUsage.length; i++) {
      this.labels.push(this.appUsage[i].appName);
      // appUsage converted from milliseconds -> minutes
      var seconds = this.appUsage[i].appTime / 1000;
      var minutes = Math.floor(seconds / 60);
      this.usage.push(minutes);
      this.backgroundColor.push("rgba(72, 121, 240, 1)");
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
    var i, day;
    for (i = weekdays.length-1; i >= 0; i--) {
      day = new Date();
      day.setDate(day.getDate() - i);
      dates.push(day); 
      names.push(weekdays[day.getDay()]);
      formatted.push(this.getFormattedDate(day));
    }

    return {
      dates: dates,
      names: names,
      formatted: formatted,
    }
  }

    // Format: YEAR-MONTH-DAY  
  // ex. '2021-05-07'
  getFormattedDate(theDate) {
    var year = theDate.getFullYear();
    var month = ("00" + (theDate.getMonth() + 1)).substr(-2, 2);
    var day = ("00" + theDate.getDate()).substr(-2, 2);
    return  `${year}-${month}-${day}`;
  }

    // Returns the data usage for specified date from given usage list. 
  getUsage(usageList, dateFormatted) {
    // will remove when db stops storing values with attached string.
    var todaysDate = dateFormatted + 'T00:00:00.000Z';
    var i, usageObj;
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

  render() {
    return (
      <div>
        <Bar
          data={{
            labels: this.labels,
            datasets: [
              {
                label: "Total Weekly Usage (Minutes)",
                data: this.usage,
                backgroundColor: this.backgroundColor,
              },
            ],
          }}
          height={400}
          width={30}
          options={{
            title: {
              display: true,
              text: "Weekly App Usage",
              fontColor: "#FFFFFF",
              fontSize: 20,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: "#FFFFFF",
                  },
                },
              ],
              xAxes: [
                {
                  ticks: { fontColor: "#FFFFFF" },
                },
              ],
            },
            maintainAspectRatio: false,
            legend: {
              position: "right",
              labels: {
                fontSize: 15,
                fontColor: "#FFFFFF",
              },
            },
          }}
        />
      </div>
    );
  }
}
