import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateSecondaryActions, EmptyStateVariant, Title } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import asyncComponent from '../../Utilities/asyncComponent';
import './sample-page.scss';

const SampleComponent = asyncComponent(() => import('../../PresentationalComponents/SampleComponent/sample-component'));

class SamplePage extends Component {
    render() {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title="System Patch Manager" />
                </PageHeader>
                <Main>
                    <EmptyState variant={ EmptyStateVariant.full }>
                        <EmptyStateIcon icon={ CubesIcon } />
                        <Title headingLevel="h5" size="lg">
                            System Patch Manager is still in onboarding process
                        </Title>
                    </EmptyState>
                </Main>
            </React.Fragment>
        );
    }
}

export default withRouter(SamplePage);
