import { Bullseye, Button, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const NoSystemData = () => (
    <Bullseye>
        <EmptyState style={{ paddingTop: 40 }}>
            <EmptyStateIcon icon={WrenchIcon} />
            <Title headingLevel="h5" size="lg">
                {intl.formatMessage(messages.statesPatchNotConfigured)}
            </Title>
            <EmptyStateBody>
                {intl.formatMessage(messages.statesActivateInsights)}
            </EmptyStateBody>
            <Button
                variant="primary"
                component="a"
                href="http://access.redhat.com/products/cloud_management_services_for_rhel#getstarted"
            >
                {intl.formatMessage(messages.linksLearnAboutInsights)}
            </Button>
        </EmptyState>
    </Bullseye>
);
