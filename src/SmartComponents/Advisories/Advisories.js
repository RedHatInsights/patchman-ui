import {
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    Title
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Main } from '@redhat-cloud-services/frontend-components';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../../PresentationalComponents/Header/Header';

class SamplePage extends Component {
    render() {
        return (
            <React.Fragment>
                <Header title={'Advisories'} showTabs />
                <Main>
                    <EmptyState variant={EmptyStateVariant.full}>
                        <EmptyStateIcon icon={CubesIcon} />
                        <Title headingLevel="h5" size="lg">
                            System Patch Manager is still in onboarding
                            processssd
                        </Title>
                    </EmptyState>
                </Main>
            </React.Fragment>
        );
    }
}

export default withRouter(SamplePage);
