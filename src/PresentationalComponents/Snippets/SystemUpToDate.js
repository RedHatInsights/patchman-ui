import {
    Bullseye,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateHeader,
    Icon
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const SystemUpToDate = () => (
    <Bullseye>
        <EmptyState style={{ paddingTop: 40 }}>
            <EmptyStateHeader
                titleText={intl.formatMessage(
                    messages.statesNoApplicableAdvisories
                )}
                icon={
                    <EmptyStateIcon
                        icon={() => (
                            <Icon size="xl" style={{ marginBottom: 15 }}>
                                <CheckCircleIcon
                                    color={
                                        'var(--pf-v5-global--success-color--200)'
                                    }
                                />
                            </Icon>
                        )}
                    />
                }
                headingLevel="h5"
            />
            <EmptyStateBody>
                {intl.formatMessage(messages.statesSystemUpToDate)}
            </EmptyStateBody>
        </EmptyState>
    </Bullseye>
);
