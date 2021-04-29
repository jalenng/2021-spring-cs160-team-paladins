import React from "react";
import { Bar } from "react-chartjs-2"

export default class UsageBarChart extends React.Component {

  /**
   * 
   * @param {*} props 
   * @param {*Number of previous usage days to track} prev_days 
   */
  constructor(props, prev_days) {
      super(props);
      this.today = new Date();
      this.prev_days = prev_days;
      this.hours = 5;
      this.breaks = 10;
  }

  // Example. if prev_days = 3 and today is Monday, returns [""]
  // Returns array of weekdays before today.
  // Used to label the bar graph.
  // Example: If today is Monday and prev_days = 3, returns ["Saturday", "Sunday", "Monday"]
  getPrevDaysLabels = () => {
    var daysLabels = []
    daysLabels.size = 5;
    let weekdays = ["Sunday, Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dayOfWeek, prevDate;
    for (var i=0; i<=daysLabels.size-1; i++) {
      prevDate = new Date();
      prevDate.setDate(prevDate.getDate() - i);
      dayOfWeek = weekdays[prevDate.getDay()];
      console.log(dayOfWeek);
      daysLabels[daysLabels.size-i-1] = dayOfWeek;
    }
    return daysLabels;
  }  

  render() {
    
    return (
      <div>
        <Bar
          data={{
            labels: getPrevDaysLabels,
            datasets: [
              {
                label: "Total usage (hours)",
                data: [this.hours],
                backgroundColor: [
                  "rgba(72, 121, 240, 1)",
                ],
              },
              {
                label: "Total # of breaks",
                data: [this.breaks],
                backgroundColor: "lightblue",
              },
            ],
          }}
          height={400}
          width={30}
          options={{
            title: {
              display: true,
              text: "Daily Timer Usage",
              fontColor: "#FFFFFF",
              fontSize: 15,
              padding: 10,
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
