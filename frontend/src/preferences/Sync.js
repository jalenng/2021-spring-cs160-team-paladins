import React from 'react';

import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

export default class extends React.Component {

    handleUploadBtn() {
        store.preferences.push();
    }

    handleDownloadBtn() {
        store.preferences.fetch();
    }

    render() {
        return (
            <Stack id="startup" tokens={{ childrenGap: 10 }} style={{ paddingBottom: '20px' }}>

                <Text variant={'xLarge'} block> Sync preferences </Text>

                <Stack horizontal tokens={{ childrenGap: 16 }}>

                    <DefaultButton
                        text="Upload"
                        iconProps={{ iconName: 'CloudUpload' }}
                        onClick={this.handleUploadBtn}
                    />

                    <DefaultButton
                        text="Download"
                        iconProps={{ iconName: 'CloudDownload' }}
                        onClick={this.handleDownloadBtn}
                    />

                </Stack>

            </Stack>
        )
    }
}