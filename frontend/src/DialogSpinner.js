import React from "react";

import { Dialog } from '@fluentui/react/lib/Dialog';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

export default class extends React.Component {

    render() {
        return (
            <Dialog hidden={!this.props.show}>
                <Spinner label={this.props.text} size={SpinnerSize.large} />
            </Dialog>
        )
    }

}