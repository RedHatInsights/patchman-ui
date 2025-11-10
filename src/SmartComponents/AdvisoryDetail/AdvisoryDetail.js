import { Stack, StackItem, Content, ContentVariants } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import messages from '../../Messages';
import AdvisoryHeader from '../../PresentationalComponents/AdvisoryHeader/AdvisoryHeader';
import Header from '../../PresentationalComponents/Header/Header';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import {
  clearAdvisoryDetailStore,
  clearEntitiesStore,
  fetchAvisoryDetails,
} from '../../store/Actions/Actions';
import { intl } from '../../Utilities/IntlProvider';
import AdvisorySystems from '../AdvisorySystems/AdvisorySystems';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const AdvisoryDetail = () => {
  const dispatch = useDispatch();
  const chrome = useChrome();
  const { advisoryId: advisoryName } = useParams();

  useEffect(() => {
    advisoryName &&
      chrome.updateDocumentTitle(`${advisoryName} - Advisories - Content | RHEL`, true);
  }, [chrome, advisoryName]);

  const advisoryDetails = useSelector(({ AdvisoryDetailStore }) => AdvisoryDetailStore);
  const status = useSelector(({ AdvisoryDetailStore }) => AdvisoryDetailStore.status);

  React.useEffect(() => {
    dispatch(fetchAvisoryDetails({ advisoryName }));
  }, []);

  React.useEffect(
    () => () => {
      dispatch(clearEntitiesStore());
      dispatch(clearAdvisoryDetailStore());
    },
    [],
  );

  const { attributes } = advisoryDetails.data;
  return (
    <React.Fragment>
      <Header
        title={advisoryName}
        headerOUIA='advisory-details'
        breadcrumbs={[
          {
            title: intl.formatMessage(messages.titlesPatchAdvisories),
            to: '/advisories',
            isActive: false,
          },
          {
            title: advisoryName,
            isActive: true,
          },
        ]}
      >
        {status.hasError ? (
          <Unavailable />
        ) : (
          <AdvisoryHeader
            attributes={{ ...attributes, id: advisoryName }}
            isLoading={status.isLoading}
          />
        )}
      </Header>
      <Main>
        <Stack hasGutter>
          <StackItem>
            <Content>
              <Content component={ContentVariants.h2}>
                {intl.formatMessage(messages.titlesAffectedSystems)}
              </Content>
            </Content>
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
