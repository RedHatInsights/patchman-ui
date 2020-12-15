import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const SystemUpToDate = () => (
    <Bullseye>
        <EmptyState style={{ paddingTop: 40 }}>
            <EmptyStateIcon icon={()=><CheckCircleIcon size='xl' color={'var(--pf-global--success-color--200)' }
                style={{ marginBottom: 15 }} />}/>
            <Title headingLevel="h5" size="lg">
                {intl.formatMessage(messages.statesNoApplicableAdvisories)}
            </Title>
            <EmptyStateBody>
                {intl.formatMessage(messages.statesSystemUpToDate)}
            </EmptyStateBody>
        </EmptyState>
    </Bullseye>
);
