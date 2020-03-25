import { Bullseye, Button, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import React from 'react';

export const NoSystemData = () => (
    <Bullseye>
        <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h5" size="lg">
                No Patch data
            </Title>
            <EmptyStateBody>
                Activate the Insights client for this system to report for applicable advisories
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
