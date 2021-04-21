import React from 'react';

import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

export default class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appInfo: {
                name: '',
                version: ''
            },
            contributors: [],
            openSourceLibraries: []
        }
    }

    componentDidMount() {
        this.setState(getAboutInfo());
    }

    render() {

        return (
            <Stack id='about' tokens={{ childrenGap: 16 }} style={{ paddingBottom: '20px' }}>

                <Text variant={'xLarge'} block> About </Text>

                <Text variant={'xxLarge'} block>  
                    {`${this.state.appInfo.name} ${this.state.appInfo.version}`}
                </Text>

                <Stack tokens={{ childrenGap: 8 }}>
                    <Text variant={'large'} block> Contributors </Text>

                    <Stack>
                        {this.state.contributors.map( contributor => {
                            return ( <Text variant={'medium'} block> {contributor} </Text> )
                        })}
                    </Stack>
                </Stack>

                <Stack tokens={{ childrenGap: 8 }}>
                    <Text variant={'large'} block> Open-source libraries </Text>

                    <Stack>
                        {this.state.openSourceLibraries.map( libName => {
                            return ( <Text variant={'medium'} block> {libName} </Text> )
                        })}
                    </Stack>
                </Stack>

            </Stack>
        )
    }
}

