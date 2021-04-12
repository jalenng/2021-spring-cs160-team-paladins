import React from 'react'
import { CountdownCircleTimerComponent } from "react-countdown-circle-timer";
import { Text } from "@fluentui/react/lib/Text";

export default function CountdownCircleTimerComponent({
    duration,
    isPlaying,
    onComplete,
    textDisplay,
}) {

    let renderTime = () => {
        return (
          <div className="time">
            <Text variant={"xxLarge"} block>
              {"You have "}
              {this.state.minutes}:{this.state.seconds}
              {" left"}
            </Text>
          </div>
        );
      };

    return (
        <CountdownCircleTimer
        // key={this.state.key}
        isPlaying={isPlaying}
        duration={this.state.minutes*60 + this.state.seconds}
        colors={[
          ["#009dff", 0.33],
          ["#F7B801", 0.33],
          ["#009dff", 0.33],
        ]}
        strokeWidth={15}
        size={280}
        onComplete={onComplete}
      >
        {textDisplay}
      </CountdownCircleTimer>
    )
}