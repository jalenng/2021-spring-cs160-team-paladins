import React from "react";

import { Text } from "@fluentui/react/lib/Text";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { Stack } from "@fluentui/react/lib/Stack";
import { FontIcon } from "@fluentui/react/lib/Icon"
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { getTheme } from '@fluentui/react';

import Circle from 'react-circle';

const { ipcRenderer } = window.require("electron");

const buttonStyle = { borderRadius: '20px', width: '40px', height: '40px' };
const buttonIconClass = mergeStyles({ fontSize: 24, height: 24, width: 24 });

export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minutes: "0",
            seconds: "0",
            state: ""
        };
    }

    componentDidMount() {
        ipcRenderer.on("receive-timer-status", (event, timerStatus) => {
            let minutes = Math.floor(timerStatus.remainingTime / 60000);
            let seconds = Math.floor((timerStatus.remainingTime % 60000) / 1000);
            seconds = ("00" + seconds).substr(-2, 2);

            this.setState({
                minutes: minutes,
                seconds: seconds,
                totalDuration: timerStatus.totalDuration,
                remainingTime: timerStatus.remainingTime,
                state: timerStatus.state,
            });
        });

        ipcRenderer.send("get-timer-status");
        setInterval(() => { ipcRenderer.send("get-timer-status") }, 1000);
    }

    updateState() { this.setState(getAccountStore()) }

    resetBtnClick() { ipcRenderer.invoke("timer-reset") };

    popOutBtnClick() { ipcRenderer.invoke("show-timer-popup") };

    handleEndBtn() { ipcRenderer.invoke("timer-end") };

    togglePause() { ipcRenderer.invoke("timer-toggle") };

    render() {

        return (
            <div>
                <Stack vertical tokens={{ childrenGap: 8 }} horizontalAlign="center" >

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
                            progress={ (this.state.remainingTime / this.state.totalDuration) * 100 } 
                            progressColor={ getTheme().palette.themePrimary }
                            bgColor={ getTheme().palette.neutralLighter }
                            roundedStroke={true} 
                            showPercentage={false} 
                        />

                        {/* Remaining time */}
                        <div className="time" style={{  position: "absolute" }}>
                            <Text variant={"xxLarge"} style={{ fontSize: "4rem" }} block>
                                {this.state.minutes}:{this.state.seconds}
                            </Text>
                        </div>

                    </div>                   

                    {/* Timer controls */}
                    <Stack horizontal tokens={{ childrenGap: 20 }}>

                        {/* Toggle button */}
                        <TooltipHost content={this.state.state === "running" ? "Pause" : "Start"}>
                            <PrimaryButton
                                disabled = {this.state.state === "idle"}
                                onClick={this.togglePause}
                                style={buttonStyle}
                                onRenderText={() => {
                                    let iconName = this.state.state === "running" ? "Pause" : "Play";
                                    return ( <FontIcon iconName={iconName} className={buttonIconClass} /> )
                                }}
                            />
                        </TooltipHost>

                        {/* Other actions */}
                        <TooltipHost content={"More"}>
                            <DefaultButton
                                disabled = {this.state.state === "blocked" || this.state.state === "idle"}
                                style={buttonStyle}
                                onRenderText={() => {
                                    return ( <FontIcon iconName="More" className={buttonIconClass} /> )
                                }}
                                menuProps={{
                                    items: [
                                        {
                                            key: "resetTimer",
                                            text: 'Reset timer',
                                            iconProps: { iconName: 'Refresh' },
                                            onClick: this.resetBtnClick
                                        },
                                        {
                                            key: "popOutTimer",
                                            text: 'Pop out',
                                            iconProps: { iconName: 'MiniExpand' },
                                            onClick: this.popOutBtnClick
                                        },
                                        {
                                            key: "startBreak",
                                            text: 'Start break (for testing purposes)',
                                            iconProps: { iconName: 'FastForward' },
                                            onClick: this.handleEndBtn
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
