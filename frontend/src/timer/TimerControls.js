import React from "react";

import { 
    PrimaryButton, DefaultButton,
    TooltipHost,
    Stack,
    FontIcon,
    mergeStyles,
} from "@fluentui/react";;

const buttonStyle = { borderRadius: "20px", width: "40px", height: "40px" };
const buttonIconClass = mergeStyles({ fontSize: 24, height: 24, width: 24 });

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (

            <Stack horizontal tokens={{ childrenGap: 20 }}>

                {/* Toggle button */}
                <TooltipHost content={this.props.mainButtonTooltip}>
                    <PrimaryButton
                        id="toggleButton"
                        disabled={this.props.mainButtonDisabled}
                        onClick={timer.toggle}
                        style={buttonStyle}
                        onRenderText={() => {
                            return <FontIcon iconName={this.props.mainButtonIconName} className={buttonIconClass} />
                        }}
                    />
                </TooltipHost>

                {/* Other actions */}
                <TooltipHost content={"More"}>
                    <DefaultButton
                        id="buttonGroup"
                        disabled={this.props.secondaryButtonDisabled}
                        style={buttonStyle}
                        onRenderText={() => { 
                            return <FontIcon iconName="More" className={buttonIconClass} /> 
                        }}
                        menuProps={{
                            items: [
                                {
                                    key: "resetTimer",
                                    text: 'Reset timer',
                                    iconProps: { iconName: 'Refresh' },
                                    onClick: timer.reset
                                },
                                {
                                    key: "popOutTimer",
                                    text: 'Pop out',
                                    iconProps: { iconName: 'MiniExpand' },
                                    onClick: showPopup.timer
                                },
                                {
                                    key: "startBreak",
                                    text: 'Start break (for testing purposes)',
                                    iconProps: { iconName: 'FastForward' },
                                    onClick: timer.end
                                }
                            ]
                        }}
                    />
                </TooltipHost>

            </Stack>

        );
    }
}