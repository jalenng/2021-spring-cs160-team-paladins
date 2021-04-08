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
      key: 0,
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

  handleClick = () => {
    ipcRenderer.invoke("timer-toggle");
    this.setState({ key: this.state.key + 1 });
  };

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
      <Stack>
        <Stack.Item align="auto">
          <CountdownCircleTimer
            key={this.state.key}
            isPlaying={this.state.buttonLabel === "STOP"}
            duration={
              //parseInt(this.state.seconds)}
              10
            }
            colors={[
              ["#009dff", 0.33],
              ["#F7B801", 0.33],
              ["#009dff", 0.33],
            ]}
            strokeWidth={15}
            size={280}
            onComplete={() => [true, 100]}
          >
            {renderTime}
          </CountdownCircleTimer>
        </Stack.Item>
        <div
          style={{
            position: "absolute",
            left: "40%",
            top: "70%",
          }}
        >
          <PrimaryButton
            text={this.state.buttonLabel}
            onClick={this.handleClick}
          />
        </div>
      </Stack>
    );
  }
}
