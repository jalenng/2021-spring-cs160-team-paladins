import React from 'react';

import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

const { ipcRenderer } = window.require('electron');

export default class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appInfo: {
                name: "",
                version: ""
            }
        }
    }

    componentDidMount() {
        ipcRenderer.send('get-app-info');

        ipcRenderer.on('receive-app-info', (event, appInfo) => {
            this.setState({appInfo});
        })
    }

    render() {

        let appInfo = this.state.appInfo

        return (
            <Stack id="about" tokens={{ childrenGap: 16 }}>

                <Text variant={'xLarge'} block> About </Text>

                <Text variant={'xxLarge'} block>  
                    {`${appInfo.name} ${appInfo.version}`}
                </Text>

                <Stack tokens={{ childrenGap: 8 }}>
                    <Text variant={'large'} block> Contributors </Text>

                    <Stack>
                        <Text variant={'medium'} block> Elise Hoang </Text>
                        <Text variant={'medium'} block> Jalen Ng </Text>
                        <Text variant={'medium'} block> Julie Loi </Text>
                        <Text variant={'medium'} block> Shiyun Lian </Text>
                        <Text variant={'medium'} block> Zuby Javed </Text>
                    </Stack>
                </Stack>

                <Stack tokens={{ childrenGap: 8 }}>
                    <Text variant={'large'} block> Open-source libraries </Text>

                    <Stack>
                        <Text variant={'medium'} block> TODO </Text>
                    </Stack>
                </Stack>

            </Stack>
        )
    }
}

