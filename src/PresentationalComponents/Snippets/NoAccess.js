import React from 'react';
import { withRouter } from 'react-router-dom';
import { LockIcon } from '@patternfly/react-icons';
import { Main } from '@redhat-cloud-services/frontend-components';
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Page, Title } from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const NoAccessPage = () => {
    return (
        <Page>
            <Main>
                <Bullseye>
                    <EmptyState variant={EmptyStateVariant.large}>
                        <EmptyStateIcon icon={LockIcon} />
                        <Title headingLevel="h5" size="lg">
                            {intl.formatMessage(messages.statesRequiresPatchPermissions)}
                        </Title>
                        <EmptyStateBody>
                            {intl.formatMessage(messages.statesMinimumPatchPermissionsRequired)}
                        </EmptyStateBody>
                    </EmptyState>
                </Bullseye>
            </Main>
        </Page>
    );
};

export default withRouter(NoAccessPage);
