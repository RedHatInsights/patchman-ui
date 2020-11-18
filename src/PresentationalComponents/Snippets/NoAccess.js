import React from 'react';
import { withRouter } from 'react-router-dom';
import { LockIcon } from '@patternfly/react-icons';
import { Main } from '@redhat-cloud-services/frontend-components';
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Page, Title } from '@patternfly/react-core';

const NoAccessPage = () => {
    return (
        <Page>
            <Main>
                <Bullseye>
                    <EmptyState variant={EmptyStateVariant.large}>
                        <EmptyStateIcon icon={LockIcon} />
                        <Title headingLevel="h5" size="lg">
                                This application requires Patch permissions
                        </Title>
                        <EmptyStateBody>
                            To view the content of this page, you must be granted a minimum of Patch permissions
                            from your Organisation Administratior
                        </EmptyStateBody>
                    </EmptyState>
                </Bullseye>
            </Main>
        </Page>
    );
};

export default withRouter(NoAccessPage);
