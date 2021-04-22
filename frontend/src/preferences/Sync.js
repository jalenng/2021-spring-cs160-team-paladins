import React from 'react';

import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

export default class extends React.Component {

    render() {
        return (
            <Stack id="startup" tokens={{ childrenGap: 10 }} style={{ paddingBottom: '20px' }}>

                <Text variant={'xLarge'} block> Sync preferences </Text>

                <Stack horizontal tokens={{ childrenGap: 16 }}>

                    <DefaultButton
                        text="Upload"
                        iconProps={{ iconName: 'CloudUpload' }}
                    />

                    <DefaultButton
                        text="Download"
                        iconProps={{ iconName: 'CloudDownload' }}
                    />

                </Stack>

            </Stack>
        )
    }
}