import React from "react";

import { Text } from "@fluentui/react/lib/Text";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const { ipcRenderer } = window.require("electron");

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: "0",
      seconds: "0",
      buttonLabel: "",
      state: "",
    };

    ipcRenderer.on("receive-timer-status", (event, timerStatus) => {
      var state = timerStatus.state;
      var buttonLabel = state === "stopped" ? "START" : "STOP";
      var milliseconds = timerStatus.remainingTime;
      var minutes = Math.floor(milliseconds / 60000);
      var seconds = Math.floor((milliseconds % 60000) / 1000);
      seconds = ("00" + seconds).substr(-2, 2);

      this.setState({
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
        buttonLabel: buttonLabel,
        state: state,
      });
    });
  }

  componentDidMount() {
    ipcRenderer.send("get-timer-status");
    setInterval(() => {
      ipcRenderer.send("get-timer-status");
    }, 1000);
  }

  render() {
    let renderTime = () => {
      return (
        <div className="time">
          <Text variant={"xxLarge"} block>
            {this.state.minutes}:{this.state.seconds}
          </Text>
        </div>
      );
    };

    return (
      <div>
        <Stack horizontal tokens={{ childrenGap: 20 }}>
          <CountdownCircleTimer
            isPlaying={this.state.buttonLabel === "STOP"}
            duration={
              //parseInt(this.state.seconds)}
              10
            }
            colors={[
              ["#004777", 0.33],
              ["#F7B801", 0.33],
              ["#A30000", 0.33],
            ]}
            onComplete={() => [true, 1000]}
          >
            {renderTime}
          </CountdownCircleTimer>

          <PrimaryButton
            text={this.state.buttonLabel}
            onClick={() => ipcRenderer.invoke("timer-toggle")}
          />
        </Stack>
      </div>
    );
  }
}
