import React from "react";

import { 
    Text,
    PrimaryButton, DefaultButton,
    TooltipHost,
    Stack,
    FontIcon,
    mergeStyles,
    getTheme
 } from "@fluentui/react";

import Circle from "react-circle";

const buttonStyle = { borderRadius: "20px", width: "40px", height: "40px" };
const buttonIconClass = mergeStyles({ fontSize: 24, height: 24, width: 24 });

export default class Timer extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            remainingTimeString: "",
            totalDuration: "",
            remainingTime: "",
            endTimeString: "",
            state: "",
            progressBarColor: ""
        };
    }

    componentDidMount() {
        this._isMounted = true;
        timer.eventSystem.on("update", (event, timerStatus) => {
            if (!this._isMounted) return;
            
            let remainingMinutes = Math.floor(timerStatus.remainingTime / 60000).toString();
            let remainingSeconds = Math.floor((timerStatus.remainingTime % 60000) / 1000);
            remainingSeconds = ("00" + remainingSeconds).substr(-2, 2);

            let endHours = timerStatus.endDate.getHours()
            endHours = endHours === 0
                ? "12"
                : endHours > 12
                    ? (endHours % 12).toString()
                    : endHours.toString();
            let endMinutes = timerStatus.endDate.getMinutes();
            endMinutes = ("00" + endMinutes).substr(-2, 2);

            let state = timerStatus.state;

            this.setState({
                remainingTimeString: `${remainingMinutes}:${remainingSeconds}`,
                totalDuration: timerStatus.totalDuration,
                remainingTime: timerStatus.remainingTime,
                endTimeString: `${endHours}:${endMinutes}`,
                state: state
            });
        });

        timer.getStatus();
        setInterval(timer.getStatus, 100);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <div>
                <Stack vertical tokens={{ childrenGap: 8 }} horizontalAlign="center">

                    {/* Timer display */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                        {/* Circular progress bar */}
                        <Circle
                            animate={false}
                            size={300}
                            lineWidth={20}
                            progress={(this.state.remainingTime / this.state.totalDuration) * 100}
                            progressColor={getTheme().palette.themePrimary}
                            bgColor={getTheme().palette.neutralLighter}
                            roundedStroke={true}
                            showPercentage={false}
                        />

                        {/* Timer information */}
                        <div className="time" style={{ position: "absolute" }}>
                            <Stack vertical horizontalAlign="center">

                                {/* Remaining time */}
                                <Text variant={"xxLarge"} style={{ fontSize: "4rem" }} block>
                                    <div id="remainingTimeText">
                                        {this.state.remainingTimeString}
                                    </div>
                                </Text>

                                {/* End time - show only if the timer is running */}
                                {this.state.state === "running" &&
                                    <TooltipHost content="End time">
                                        <DefaultButton
                                            style={{ ...buttonStyle, height: "28px" }}
                                            iconProps={{ iconName: 'Ringer' }}
                                            text={this.state.endTimeString}
                                            disabled
                                        />
                                    </TooltipHost>
                                }

                                {/* Blocked indicator - show only if the timer is blocked */}
                                {this.state.state === "blocked" &&
                                    <DefaultButton
                                        style={{ ...buttonStyle, height: "28px" }}
                                        iconProps={{ iconName: 'Blocked2' }}
                                        disabled
                                    />
                                }

                            </Stack>
                        </div>

                    </div>

                    {/* Timer controls */}
                    <Stack horizontal tokens={{ childrenGap: 20 }}>

                        {/* Toggle button */}
                        <TooltipHost content={this.state.state === "running" ? "Pause" : "Start"}>
                            <PrimaryButton
                                id="toggleButton"
                                disabled={this.state.state === "idle"}
                                onClick={timer.toggle}
                                style={buttonStyle}
                                onRenderText={() => {
                                    let iconName = this.state.state === "running" ? "Pause" : "Play";
                                    return (<FontIcon iconName={iconName} className={buttonIconClass} />)
                                }}
                            />
                        </TooltipHost>

                        {/* Other actions */}
                        <TooltipHost content={"More"}>
                            <DefaultButton
                                id="buttonGroup"
                                disabled={this.state.state === "blocked" || this.state.state === "idle"}
                                style={buttonStyle}
                                onRenderText={() => {
                                    return (<FontIcon iconName="More" className={buttonIconClass} />)
                                }}
                                menuProps={{
                                    items: [
                                        {
                                            key: "resetTimer",
                                            text: 'Reset timer',
                                            iconProps: { iconName: 'Refresh' },
                                            onClick: timer.reset
                                        },
                                        {
                                            key: "popOutTimer",
                                            text: 'Pop out',
                                            iconProps: { iconName: 'MiniExpand' },
                                            onClick: showPopup.timer
                                        },
                                        {
                                            key: "startBreak",
                                            text: 'Start break (for testing purposes)',
                                            iconProps: { iconName: 'FastForward' },
                                            onClick: timer.end
                                        }
                                    ]
                                }}
                            />
                        </TooltipHost>

                    </Stack>

                </Stack>

            </div>
        );
    }
}