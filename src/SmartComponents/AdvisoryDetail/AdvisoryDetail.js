import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AdvisoryHeader from '../../PresentationalComponents/AdvisoryHeader/AdvisoryHeader';
import Header from '../../PresentationalComponents/Header/Header';
import { paths } from '../../Routes';
import {
    clearAdvisoryDetailStore,
    clearAffectedSystemsStore,
    fetchAvisoryDetails
} from '../../store/Actions/Actions';
import AffectedSystems from '../AffectedSystems/AffectedSystems';

const AdvisoryDetail = ({ match }) => {
    const dispatch = useDispatch();
    const [advisoryName] = React.useState(match.params.advisoryId);
    const advisoryDetails = useSelector(
        ({ AdvisoryDetailStore }) => AdvisoryDetailStore
    );
    React.useEffect(() => {
        dispatch(fetchAvisoryDetails({ advisoryName }));
    }, []);

    React.useEffect(() => {
        return () => {
            dispatch(clearAffectedSystemsStore());
            dispatch(clearAdvisoryDetailStore());
        };
    }, []);

    const { attributes } = advisoryDetails.data;
    return (
        <React.Fragment>
            <Header
                title={advisoryName}
                breadcrumbs={[
                    {
                        title: 'System Patching',
                        to: paths.advisories.to,
                        isActive: false
                    },
                    {
                        title: advisoryName,
                        isActive: true
                    }
                ]}
            >
                <AdvisoryHeader
                    attributes={{ ...attributes, id: advisoryName }}
                    isLoading={advisoryDetails.isLoading}
                />
            </Header>
            <Main>
                <TextContent>
                    <Text component={TextVariants.h2}>Affected Systems</Text>
                </TextContent>
                <AffectedSystems advisoryName={advisoryName} />
            </Main>
        </React.Fragment>
    );
};

AdvisoryDetail.propTypes = {
    match: propTypes.any
};

export default withRouter(AdvisoryDetail);
