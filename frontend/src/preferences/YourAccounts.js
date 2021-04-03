import React from 'react';

import { DefaultButton, ActionButton } from '@fluentui/react/lib/Button';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

const {
    getAccountStore,
    signOut
 } = require('../storeHelperFunctions');

 
export default class PreferencesContents extends React.Component {

    render() {

        // Get account store info from account store
        const accountStore = getAccountStore();

        const isSignedIn = accountStore.token != null
        const displayName = accountStore.accountInfo.displayName

        let regex = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
        let displayInitials = [...displayName.matchAll(regex)] || [];
        displayInitials = (
            (displayInitials.shift()?.[1] || '') + (displayInitials.pop()?.[1] || '')
        ).toUpperCase();

        const yourAccountsPersona = {
            imageInitials: displayInitials,
            text: displayName,

            // Display "Sign out" and "Delete account" button only if signed in
            onRenderSecondaryText: () => {
                if (isSignedIn) {
                    return (
                        <Stack horizontal
                            verticalAlign="center"
                            style={{ marginTop: "6px" }}
                            tokens={{ childrenGap: 20 }}
                        >
                            <DefaultButton text="Sign out" onClick={signOut} />
                            <ActionButton> Delete account </ActionButton>
                        </Stack>
                    )
                }
            }
        };

        return (

            <Stack id="your_accounts" tokens={{ childrenGap: 10 }}>

                <Text variant={'xLarge'} block> Your account </Text>

                <Persona
                    {...yourAccountsPersona}
                    size={PersonaSize.size100}
                />

            </Stack>

        )
    }
}