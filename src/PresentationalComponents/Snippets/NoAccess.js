import React from 'react';
import { withRouter } from 'react-router-dom';
import { LockIcon } from '@patternfly/react-icons';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon,
    EmptyStateVariant, Page, Title, Button } from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';

const NoAccessPage = () => {
    return (
        <Page>
            <Header title={intl.formatMessage(messages.generalAppName)} headerOUIA={'systems'} />
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

                        { (document.referrer ?
                            <Button variant="primary" onClick={() => history.back()}>Go to previous page</Button> :
                            <Button variant="primary" component="a" href=".">Go to landing page</Button>
                        )}
                    </EmptyState>
                </Bullseye>
            </Main>
        </Page>
    );
};

export default withRouter(NoAccessPage);
