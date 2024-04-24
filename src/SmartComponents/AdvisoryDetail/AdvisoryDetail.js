import { Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import messages from '../../Messages';
import AdvisoryHeader from '../../PresentationalComponents/AdvisoryHeader/AdvisoryHeader';
import Header from '../../PresentationalComponents/Header/Header';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { clearAdvisoryDetailStore, clearEntitiesStore, fetchAvisoryDetails } from '../../store/Actions/Actions';
import { intl } from '../../Utilities/IntlProvider';
import AdvisorySystems from '../AdvisorySystems/AdvisorySystems';
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const AdvisoryDetail = () => {
    const dispatch = useDispatch();
    const chrome = useChrome();
    const { advisoryId: advisoryName } = useParams();

    useEffect(()=>{
        advisoryName &&
        chrome.updateDocumentTitle(`${advisoryName} - Advisories - Content | RHEL`);
    }, [chrome, advisoryName]);

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
            dispatch(clearEntitiesStore());
            dispatch(clearAdvisoryDetailStore());
            dispatch(clearNotifications());
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
                        to: '/advisories',
                        isActive: false
                    },
                    {
                        title: advisoryName,
                        isActive: true
                    }
                ]}
            >{status.hasError ? <Unavailable /> :
                    <AdvisoryHeader
                        attributes={{ ...attributes, id: advisoryName }}
                        isLoading={status.isLoading}
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

export default AdvisoryDetail;
