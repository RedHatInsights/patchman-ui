import React from 'react';
import propTypes from 'prop-types';
import { PowerOffIcon } from '@patternfly/react-icons';
import { intl } from '../../Utilities/IntlProvider';
import { fetchApplicableAdvisoriesApi } from '../../Utilities/api/api';
import messages from '../../Messages';
import { CardTitle, Card, Grid, GridItem, CardBody, Title, Icon } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { handlePatchLink, handleLongSynopsis } from '../../Utilities/Helpers';
import { entityTypes } from '../../Utilities/constants';
import AdvisoryType from '../AdvisoryType/AdvisoryType';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import AdvisorySeverity from '../AdvisorySeverity/AdvisorySeverity';

const StatusCard = ({ advisory: { attributes, id } }) => (
  <Card isFullHeight>
    <CardTitle>{handlePatchLink(entityTypes.advisories, id)}</CardTitle>
    <CardBody>
      <Grid>
        <GridItem span={6}>
          <AdvisoryType type={attributes.advisory_type_name} />
          {processDate(attributes.public_date)}
          {attributes.os_name && attributes.os_name}
        </GridItem>
        <GridItem span={6}>
          {attributes.severity && (
            <AdvisorySeverity gap='gapMd' size='md' severity={attributes.severity} />
          )}
          {attributes.reboot_required && (
            <>
              <Icon status='danger'>
                <PowerOffIcon />
              </Icon>
              {intl.formatMessage(messages.textRebootIsRequired)}
            </>
          )}
        </GridItem>
      </Grid>
      {handlePatchLink(
        entityTypes.advisories,
        id,
        intl.formatMessage(messages.labelsAffectedSystemsCount, {
          systemsCount: attributes.applicable_systems,
        }),
      )}
      {handleLongSynopsis(attributes.synopsis)}
    </CardBody>
  </Card>
);

const AdvisoriesStatusBar = () => {
  const [advisories, setAdvisories] = React.useState({});
  React.useEffect(() => {
    fetchApplicableAdvisoriesApi({
      limit: 4,
      sort: '-advisory_type_name,-applicable_systems',
    }).then(setAdvisories);
  }, []);

  return (
    (advisories.data && advisories.data.length && (
      <Main
        style={{
          paddingBottom: 'var(--pf-t--global--spacer--control--vertical--spacious)',
          paddingTop: 0,
        }}
      >
        <Title headingLevel='h3' className='pf-v6-u-my-md'>
          {intl.formatMessage(messages.titlesMostImpactfulAdvisories)}
        </Title>

        <Grid hasGutter>
          {advisories.data.map((advisory) => (
            <GridItem key={advisory.id} lg={3} md={3} sm={12}>
              <StatusCard advisory={advisory} />
            </GridItem>
          ))}
        </Grid>
      </Main>
    )) ||
    null
  );
};

StatusCard.propTypes = {
  advisory: propTypes.object,
};
export default AdvisoriesStatusBar;
