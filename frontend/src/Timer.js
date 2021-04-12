import React from 'react';

import { Text } from '@fluentui/react/lib/Text';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const { ipcRenderer } = window.require('electron');

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: '0',
      seconds: '0',
      buttonLabel: '',
      state: '',
      key: 0,
      isAnimate: 'true',
    };

    ipcRenderer.on('receive-timer-status', (event, timerStatus) => {
      var state = timerStatus.state;
      var buttonLabel = state === 'stopped' ? 'START' : 'RESET';
      var milliseconds = timerStatus.remainingTime;
      var minutes = Math.floor(milliseconds / 60000);
      var seconds = Math.floor((milliseconds % 60000) / 1000);
      seconds = ('00' + seconds).substr(-2, 2);
      var isAnimate = state === 'running' ? 'true' : 'false';

      this.setState({
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
        buttonLabel: buttonLabel,
        state: state,
        isAnimate: isAnimate,
      });
    });
  }

  componentDidMount() {
    ipcRenderer.on('receive-timer-status', (event, timerStatus) => {
      var state = timerStatus.state;
      var buttonLabel = state === 'stopped' ? 'START' : 'RESET';
      var milliseconds = timerStatus.remainingTime;
      var minutes = Math.floor(milliseconds / 60000);
      var seconds = Math.floor((milliseconds % 60000) / 1000);
      seconds = ('00' + seconds).substr(-2, 2);

      this.setState({
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
        buttonLabel: buttonLabel,
        state: state,
      });
    });

    ipcRenderer.send('get-timer-status');
    setInterval(() => {
      ipcRenderer.send('get-timer-status');
    }, 1000);
  }

  updateState() {
    this.setState(getAccountStore());
  }

  handleClick = () => {
    ipcRenderer.invoke('timer-toggle');
    this.setState({ key: this.state.key + 1 });
  };

  handleEndBtn = () => {
    ipcRenderer.invoke('timer-end');
    this.setState({ key: this.state.key - 1 });
  };

  render() {
    let renderTime = () => {
      return (
        <Stack vertical tokens={{ childrenGap: 20 }}>
            {/* Remaining Timer Duration */}
            <div className='time'>
                <Text variant={'xxLarge'} style={{fontSize: '3rem'}} block>
                    {this.state.minutes}:{this.state.seconds}
                </Text>
            </div>

            {/* Current Timer State */}
            <Text variant={'large'} nowrap block>
                {this.state.state}
            </Text>

            <Stack horizontal tokens={{ childrenGap: 20 }}>
              <PrimaryButton
                    id='startBtn'
                    text='PAUSE'
                    onClick={console.log('paused')}
              />              
              <PrimaryButton
                    id='startBtn'
                    text={this.state.buttonLabel}
                    onClick={this.handleClick}
              />
            </Stack>

            {/* For development and testing purposes */}
            <DefaultButton
                text='Start break'
                id='endBtn'
                onClick={this.handleEndBtn}
            />
        </Stack>
      );
    };

    let duration = parseInt(this.state.minutes) * parseInt(this.state.seconds)

    return (
      <div>
          <CountdownCircleTimer
            key={this.state.key}
            isPlaying={this.state.isAnimate == 'true'}
            duration={0}
            colors={[
              ['#009dff', 0.33],
              ['#F7B801', 0.33],
              ['#009dff', 0.33],
            ]}
            strokeWidth={15}
            size={330}
            onComplete={() => [true, 100]}
          >
            {renderTime}
          </CountdownCircleTimer>
      </div>
    );
  }
}
