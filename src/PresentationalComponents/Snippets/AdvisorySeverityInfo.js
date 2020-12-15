import { Text, TextContent, TextVariants, Popover } from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

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
                            {intl.formatMessage(messages.linksSearchSecurityRatings)}
                        </FlexItem>
                    </Flex>
                </a>
            }
        >
            <a>{intl.formatMessage(messages.linksLearnMore)}</a>
        </Popover>
    );
};

AdvisorySeverityInfo.propTypes = {
    severity: propTypes.object
};

export default AdvisorySeverityInfo;
