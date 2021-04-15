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
      togglePauseLabel: '',
      state: '',
      key: 0,
      isAnimate: 'true',
    };
  }

  componentDidMount() {
    ipcRenderer.on('receive-timer-status', (event, timerStatus) => {
      var state = timerStatus.state;
      var togglePauseLabel = state !== 'Running' ? 'START' : 'PAUSE';
      var milliseconds = timerStatus.remainingTime;
      var minutes = Math.floor(milliseconds / 60000);
      var seconds = Math.floor((milliseconds % 60000) / 1000);
      seconds = ('00' + seconds).substr(-2, 2);
      var isAnimate = state === 'Running' ? 'true' : 'false';

      this.setState({
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
        togglePauseLabel: togglePauseLabel,
        state: state,
        isAnimate: isAnimate,
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

  resetBtnClick = () => {
    ipcRenderer.invoke('timer-reset');
    this.setState({ key: this.state.key + 1 });
  }

  handleEndBtn = () => {
    ipcRenderer.invoke('timer-end');
    this.setState({ key: this.state.key - 1 });
  };

  togglePause = () => {
    ipcRenderer.invoke('pause-toggle')
  }

  render() {
    let timerComponents = () => {
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
                  text={this.state.togglePauseLabel}
                  onClick={this.togglePause}
              />
              <PrimaryButton
                    text={'RESET'}
                    onClick={this.resetBtnClick}
              />
            </Stack>

            {/* For development and testing purposes */}
            <DefaultButton
                text='Start break'
                onClick={this.handleEndBtn}
            />
        </Stack>
      );
    };

    return (
      <div>
          <CountdownCircleTimer
            key={this.state.key}
            isPlaying={this.state.isAnimate == 'true'}
            duration={60}
            colors={[
              ['#009dff', 0.33],
              ['#F7B801', 0.33],
              ['#009dff', 0.33],
            ]}
            strokeWidth={15}
            size={330}
            onComplete={() => [true, 100]}
          >
            {timerComponents}
          </CountdownCircleTimer>
      </div>
    );
  }
}
