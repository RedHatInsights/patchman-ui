import { Text, TextContent, TextVariants } from '@patternfly/react-core/dist/js/components/Text';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AdvisoryHeader from '../../PresentationalComponents/AdvisoryHeader/AdvisoryHeader';
import Header from '../../PresentationalComponents/Header/Header';
import Error from '../../PresentationalComponents/Snippets/Error';
import { paths } from '../../Routes';
import { clearAdvisoryDetailStore, clearAffectedSystemsStore, fetchAvisoryDetails } from '../../store/Actions/Actions';
import { STATUS_LOADING, STATUS_REJECTED } from '../../Utilities/constants';
import AffectedSystems from '../AffectedSystems/AffectedSystems';

const AdvisoryDetail = ({ match }) => {
    const dispatch = useDispatch();
    const [advisoryName] = React.useState(match.params.advisoryId);
    const advisoryDetails = useSelector(
        ({ AdvisoryDetailStore }) => AdvisoryDetailStore
    );
    const status = useSelector(
        ({ AdvisoryDetailStore }) => AdvisoryDetailStore.status
    );
    const error = useSelector(
        ({ AdvisoryDetailStore }) => AdvisoryDetailStore.error
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
            >{status === STATUS_REJECTED ? <Error message={error.detail}/> :
                    <AdvisoryHeader
                        attributes={{ ...attributes, id: advisoryName }}
                        isLoading={status === STATUS_LOADING}
                    />}
            </Header>
            <Main>
                <TextContent>
                    <Text component={TextVariants.h2}>Affected systems</Text>
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
