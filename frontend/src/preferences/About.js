import React from 'react';

import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

import logo from '../assets/icon.png';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appInfo: {
                name: '',
                version: ''
            },
            versions: {
                
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
            <Stack id='about' tokens={{ childrenGap: 24 }} style={{ paddingBottom: '20px' }}>

                <Text variant={'xLarge'} block> About </Text>

                {/* Version info */}
                <Stack tokens={{ childrenGap: 8 }}>

                    <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 16 }}>
                        
                        <Image
                            imageFit={ImageFit.centerContain}
                            src={ logo }
                            width={96}
                            height={96}
                        />

                        <Stack vertical tokens={{ childrenGap: 8 }}>

                            <Text variant={'xxLarge'} block>  
                                {`${this.state.appInfo.name} ${this.state.appInfo.version}`}
                            </Text>
                            
                        </Stack>

                    </Stack>

                    <Stack>

                        <Text variant={'medium'} block>
                            <b>Electron:&nbsp;</b> {this.state.versions.electron}
                        </Text>

                        <Text variant={'medium'} block>
                            <b>Chrome:&nbsp;</b> {this.state.versions.chrome}
                        </Text>

                        <Text variant={'medium'} block>
                            <b>Node:&nbsp;</b> {this.state.versions.node}
                        </Text>

                        <Text variant={'medium'} block>
                            <b>v8:&nbsp;</b> {this.state.versions.v8}
                        </Text>

                    </Stack>

                </Stack>

                {/* Contributors */}
                <Stack tokens={{ childrenGap: 8 }}>
                    <Text variant={'xLarge'} block> Contributors </Text>

                    <Stack>
                        {this.state.contributors.map( contributor => {
                            return ( <Text variant={'medium'} block> {contributor} </Text> )
                        })}
                    </Stack>
                </Stack>

                {/* Attributions to open-source libraries */}
                <Stack tokens={{ childrenGap: 8 }}>
                    <Text variant={'xLarge'} block> Open-source libraries </Text>

                    <div style={{
                        display: 'grid',
                        gridColumn: '2'
                    }}>
                        {this.state.openSourceLibraries.map( libName => {
                            return ( <Text variant={'medium'} block> {libName} </Text> )
                        })}
                    </div>
                </Stack>

            </Stack>
        )
    }
}

