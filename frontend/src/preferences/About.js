import React from 'react';

import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

export default class About extends React.Component {

    render() {

        return (

            <Stack id="about" tokens={{ childrenGap: 10 }}>

                <Text variant={'xLarge'} block> About </Text>

                <Stack tokens={{ childrenGap: 8 }}>
                    <Text variant={'large'} block> Contributors </Text>
                </Stack>

                <Stack tokens={{ childrenGap: 8 }}>
                    <Text variant={'large'} block> Open-source libraries </Text>
                </Stack>

            </Stack>

        )
    }
}

