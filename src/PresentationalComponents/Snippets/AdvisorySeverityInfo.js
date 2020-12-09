import { Text, TextContent, TextVariants, Popover } from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';

const AdvisorySeverityInfo = ({ severity }) => {
    return (
        <Popover
            position="bottom"
            enableFlip
            headerContent={<div>{severity.label + ' severity'}</div>}
            bodyContent={
                <TextContent>
                    <Text component={TextVariants.p}>{severity.text}</Text>
                </TextContent>
            }
            footerContent={
                <a
                    href="https://access.redhat.com/security/updates/classification/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Flex>
                        <FlexItem spacer={{ default: 'spacerSm' }}>
                            <ExternalLinkSquareAltIcon />
                        </FlexItem>
                        <FlexItem spacer={{ default: 'spacerSm' }}>
                            Learn more about security ratings
                        </FlexItem>
                    </Flex>
                </a>
            }
        >
            <a>Learn more</a>
        </Popover>
    );
};

AdvisorySeverityInfo.propTypes = {
    severity: propTypes.object
};

export default AdvisorySeverityInfo;
