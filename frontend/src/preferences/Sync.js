import React from 'react';

import DialogSpinner from "../DialogSpinner";

import { MessageBarType } from '@fluentui/react/lib/MessageBar';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
        this.handleUploadBtn = this.handleUploadBtn.bind(this);
        this.handleDownloadBtn = this.handleDownloadBtn.bind(this);
    }

    // Change spinner status
    setSpinner(isLoading) {
        let state = this.state;
        state.isLoading = isLoading;
        this.setState(state);
    }

    handleUploadBtn() {
        this.setSpinner(true);
        store.preferences.push()
            .then(result => {
                console.log(result);

                // Show message
                store.messages.add({
                    type: result.success 
                        ? MessageBarType.success 
                        : MessageBarType.error,
                    contents: result.success
                        ? 'Successfully uploaded preferences'
                        : `Failed to upload preferences: ${result.data.message}`
                })
                    
                this.setSpinner(false);
            });
    }

    handleDownloadBtn() {
        this.setSpinner(true);
        store.preferences.fetch()
            .then(result => {
                console.log(result);

                // Show message
                store.messages.add({
                    type: result.success 
                        ? MessageBarType.success 
                        : MessageBarType.error,
                    contents: result.success
                        ? 'Successfully downloaded preferences'
                        : `Failed to download preferences: ${result.data.message}`
                })
                    
                this.setSpinner(false);
            });
    }

    render() {
        return (
            <div>
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

                <DialogSpinner
                    show={this.state.isLoading}
                    text='Syncing your preferences'
                />

            </div>
        )
    }
}