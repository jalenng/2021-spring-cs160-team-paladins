import React from "react";

import { Text } from '@fluentui/react/lib/Text';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';

const { ipcRenderer } = window.require('electron');

export default class Timer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            minutes: "0", 
            seconds: "0",
            buttonLabel: "",
            state: "",
        };
    }
    
    componentDidMount() {
        ipcRenderer.on('receive-timer-status', (event, timerStatus) => {
            
            var state = timerStatus.state;
            var buttonLabel = state === "stopped" ? "START" : "STOP";
            var milliseconds = timerStatus.remainingTime;
            var minutes = Math.floor(milliseconds / 60000);
            var seconds = Math.floor((milliseconds % 60000) / 1000);
            seconds = ("00" + seconds).substr(-2,2);

            this.setState({
                minutes: minutes,
                seconds: seconds,
                milliseconds: milliseconds,
                buttonLabel: buttonLabel,
                state: state,
            });

        })

        ipcRenderer.send('get-timer-status');
        setInterval(() => {ipcRenderer.send('get-timer-status')}, 1000);
    }

    updateState() {
        this.setState(getAccountStore());
    }

    render() {

        return (
            <div>
                <Stack horizontal tokens={{ childrenGap: 20 }}>

                    <Text variant={'large'} nowrap block>
                        {this.state.state}
                    </Text>

                    <Text variant={'xLarge'} nowrap block>
                        {this.state.minutes}:{this.state.seconds}
                    </Text>

                    <PrimaryButton
                        text={this.state.buttonLabel}
                        onClick={() => ipcRenderer.invoke('timer-toggle')}
                    />

                </Stack>
            </div>
        );
    }
}