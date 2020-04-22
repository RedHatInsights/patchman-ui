import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import React from 'react';

export const SystemUpToDate = () => (
    <Bullseye>
        <EmptyState style={{ paddingTop: 40 }}>
            <EmptyStateIcon icon={CheckCircleIcon} size='md' color={'var(--pf-global--success-color--200)'}/>
            <Title headingLevel="h5" size="lg">
                No applicable advisories
            </Title>
            <EmptyStateBody>
                This system is up to date, based on package information submitted at the most recent system check-in
            </EmptyStateBody>
        </EmptyState>
    </Bullseye>
);
