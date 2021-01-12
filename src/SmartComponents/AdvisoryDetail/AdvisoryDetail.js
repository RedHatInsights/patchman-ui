import { Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import messages from '../../Messages';
import AdvisoryHeader from '../../PresentationalComponents/AdvisoryHeader/AdvisoryHeader';
import Header from '../../PresentationalComponents/Header/Header';
import { Unavailable } from '@redhat-cloud-services/frontend-components';
import { paths } from '../../Routes';
import { clearAdvisoryDetailStore, clearAdvisorySystemsStore, fetchAvisoryDetails } from '../../store/Actions/Actions';
import { STATUS_LOADING, STATUS_REJECTED } from '../../Utilities/constants';
import { setPageTitle } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import AdvisorySystems from '../AdvisorySystems/AdvisorySystems';

const AdvisoryDetail = ({ match }) => {
    const dispatch = useDispatch();
    const [advisoryName] = React.useState(match.params.advisoryId);

    const pageTitle = `${advisoryName} - ${intl.formatMessage(messages.titlesAdvisories)}`;
    setPageTitle(pageTitle);

    const advisoryDetails = useSelector(
        ({ AdvisoryDetailStore }) => AdvisoryDetailStore
    );
    const status = useSelector(
        ({ AdvisoryDetailStore }) => AdvisoryDetailStore.status
    );

    React.useEffect(() => {
        dispatch(fetchAvisoryDetails({ advisoryName }));
    }, []);

    React.useEffect(() => {
        return () => {
            dispatch(clearAdvisorySystemsStore());
            dispatch(clearAdvisoryDetailStore());
        };
    }, []);

    const { attributes } = advisoryDetails.data;
    return (
        <React.Fragment>
            <Header
                title={advisoryName}
                headerOUIA={'advisory-details'}
                breadcrumbs={[
                    {
                        title: intl.formatMessage(messages.titlesPatchAdvisories),
                        to: paths.advisories.to,
                        isActive: false
                    },
                    {
                        title: advisoryName,
                        isActive: true
                    }
                ]}
            >{status === STATUS_REJECTED ? <Unavailable /> :
                    <AdvisoryHeader
                        attributes={{ ...attributes, id: advisoryName }}
                        isLoading={status === STATUS_LOADING}
                    />}
            </Header>
            <Main>
                <Stack hasGutter>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>{intl.formatMessage(messages.titlesAffectedSystems)}</Text>
                        </TextContent>
                    </StackItem>
                    <StackItem>
                        <AdvisorySystems advisoryName={advisoryName} />
                    </StackItem>
                </Stack>
            </Main>
        </React.Fragment>
    );
};

AdvisoryDetail.propTypes = {
    match: propTypes.any
};

export default withRouter(AdvisoryDetail);
