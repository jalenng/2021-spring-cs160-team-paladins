import React from 'react';

import { DefaultButton, ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';

const { ipcRenderer } = window.require('electron');

const {
    getAccountStore,
    signOut
} = require('../storeHelperFunctions');

 
export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = getAccountStore();
    }

    componentDidMount() {
        // Update this component's state when account is updated
        ipcRenderer.on('account-store-changed', () => {
            this.updateState();
        })
    }

    updateState() {
        this.setState(getAccountStore());
    }

    render() {

        // Get account store info from account store
        const isSignedIn = this.state.token != null
        const displayName = this.state.accountInfo.displayName
        const email = this.state.accountInfo.email

        const regex = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
        let displayInitials = [...displayName.matchAll(regex)] || [];
        displayInitials = (
            (displayInitials.shift()?.[1] || '') + (displayInitials.pop()?.[1] || '')
        ).toUpperCase();

        const yourAccountsPersona = {
            imageInitials: displayInitials,
            text: displayName,

            // Display email address only if signed in
            onRenderSecondaryText: () => {
                if (isSignedIn) {
                    return (
                        <Text> {email} </Text> 
                    )
                }
            },

            // Display "Sign out" and "Delete account" button only if signed in
            onRenderTertiaryText: () => {
                if (isSignedIn) {
                    return (
                        <Stack horizontal
                            verticalAlign="center"
                            style={{ marginTop: "12px" }}
                            tokens={{ childrenGap: 20 }}
                        >
                            <DefaultButton text="Sign out" onClick={signOut} />
                            <ActionButton onClick={() => ipcRenderer.invoke('show-delete-account-popup')}> 
                                Delete account 
                            </ActionButton>
                        </Stack>
                    )
                }
            }
        };

        return (

            <Stack id="your_accounts" tokens={{ childrenGap: 10 }}>

                <Stack horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 16 }} >
                    <Text variant={'xLarge'} block> Your account </Text>

                    {/* Show Edit button only if signed in */}
                    { isSignedIn && 
                        <TooltipHost content="Edit account details">
                            <IconButton
                                iconProps={{ iconName: 'Edit' }}
                                onClick={() => ipcRenderer.invoke('show-edit-account-popup')}
                            />
                        </TooltipHost>
                        
                    }
                </Stack>

                <Persona
                    {...yourAccountsPersona}
                    size={PersonaSize.size100}
                />

            </Stack>
        )
    }
}