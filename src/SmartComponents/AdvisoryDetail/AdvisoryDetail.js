import { Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AdvisoryHeader from '../../PresentationalComponents/AdvisoryHeader/AdvisoryHeader';
import Header from '../../PresentationalComponents/Header/Header';
import Error from '../../PresentationalComponents/Snippets/Error';
import { paths } from '../../Routes';
import { clearAdvisoryDetailStore, clearAdvisorySystemsStore, fetchAvisoryDetails } from '../../store/Actions/Actions';
import { STATUS_LOADING, STATUS_REJECTED } from '../../Utilities/constants';
import AdvisorySystems from '../AdvisorySystems/AdvisorySystems';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { setPageTitle } from '../../Utilities/Hooks';

const AdvisoryDetail = ({ match }) => {
    const dispatch = useDispatch();
    const [advisoryName] = React.useState(match.params.advisoryId);

    const pageTitle = `${advisoryName} - ${intl.formatMessage(messages.advisories)}`;
    setPageTitle(pageTitle);

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
                        title: intl.formatMessage(messages.appName),
                        to: paths.advisories.to,
                        isActive: false
                    },
                    {
                        title: intl.formatMessage(messages.advisories),
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
                <Stack hasGutter>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>{intl.formatMessage(messages.affectedSystems)}</Text>
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
