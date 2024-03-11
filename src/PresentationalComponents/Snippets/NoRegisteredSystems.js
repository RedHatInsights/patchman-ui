import React from 'react';
import propTypes from 'prop-types';
import {
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateHeader,
    EmptyStateFooter
} from '@patternfly/react-core';
import { DisconnectedIcon } from '@patternfly/react-icons';

const NoRegisteredSystems = ({ titleText, bodyText, buttonText }) => (
    <EmptyState>
        <EmptyStateHeader
            titleText={titleText}
            icon={<EmptyStateIcon icon={DisconnectedIcon} />}
            headingLevel="h5"
        />
        <EmptyStateBody>{bodyText}</EmptyStateBody>
        <EmptyStateFooter>
            <Button
                variant="primary"
                component="a"
                href="https://access.redhat.com/products/red-hat-insights#getstarted"
                target="_blank"
                rel="noopener noreferrer"
                className="pf-v5-u-mt-lg"
            >
                {buttonText}
            </Button>
        </EmptyStateFooter>
    </EmptyState>
);

NoRegisteredSystems.propTypes = {
    titleText: propTypes.string,
    bodyText: propTypes.string,
    buttonText: propTypes.string
};

NoRegisteredSystems.defaultProps = {
    titleText: 'Do more with your Red Hat Enterprise Linux environment',
    bodyText: `Connect your systems to keep your Red Hat environment running efficiently,
     with security and compliance with various standards.`,
    buttonText: 'Learn more about connecting your systems'
};
export default NoRegisteredSystems;
