import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Popover } from '@patternfly/react-core/dist/js/components/Popover/Popover';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';

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
                    <span className={'icon-with-label'}>
                        <ExternalLinkSquareAltIcon />
                        Learn more about security ratings
                    </span>
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
