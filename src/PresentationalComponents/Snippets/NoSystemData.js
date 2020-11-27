import { Bullseye, Button, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import React from 'react';

export const NoSystemData = () => (
    <Bullseye>
        <EmptyState style={{ paddingTop: 40 }}>
            <EmptyStateIcon icon={WrenchIcon} />
            <Title headingLevel="h5" size="lg">
                Patch is not yet configured
            </Title>
            <EmptyStateBody>
                Activate the Insights client
            </EmptyStateBody>
            <Button
                variant="primary"
                component="a"
                href="http://access.redhat.com/products/cloud_management_services_for_rhel#getstarted"
            >
                Learn about the Insights client
            </Button>
        </EmptyState>
    </Bullseye>
);
