import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircleIcon, BundleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { CardTitle, Skeleton, Card, Grid, CardBody, CardHeader } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { fetchSystems } from '../../Utilities/api/api';
import IconWithLabel from '../Snippets/IconWithLabel';

import './Card.css';

const StatusCard = ({ title, color, Icon, value, filter, apply }) => (
  <Card isFullHeight isClickable>
    <CardHeader selectableActions={{ onClickAction: () => apply(filter) }}>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardBody>
      {(typeof value === 'undefined' && <Skeleton width='24px' />) || (
        <IconWithLabel icon={<Icon color={color} />} size='md' label={value} />
      )}
    </CardBody>
  </Card>
);

const SystemsStatusReport = ({ apply, queryParams }) => {
  const [subtotals, setSubtotals] = React.useState({});

  const { selectedTags, selectedGlobalTags, systemProfile } = useSelector(
    ({ GlobalFilterStore }) => GlobalFilterStore,
  );

  const fetchResource = () => {
    setSubtotals({});

    let result;

    try {
      result = fetchSystems({
        filter: {
          os: queryParams?.filter?.os,
        },
        selectedTags: [...selectedTags, ...selectedGlobalTags],
        systemProfile,
        limit: 1,
        'filter[stale]': 'in:true,false',
      }).then((result) => {
        setSubtotals(result.meta?.subtotals);
      });
    } catch {
      result = [];
    }

    return result;
  };

  React.useEffect(() => {
    fetchResource();
  }, [
    queryParams?.filter?.os?.length,
    queryParams?.filter?.os !== undefined,
    selectedTags?.length,
    selectedTags !== undefined,
    selectedGlobalTags?.length,
    selectedGlobalTags !== undefined,
    systemProfile,
    queryParams?.subtotals !== undefined,
  ]);

  return (
    <Main>
      <Grid hasGutter xl2={3} xl={4} md={4} sm={12}>
        <StatusCard
          title={intl.formatMessage(messages.labelsStatusSystemsUpToDate)}
          Icon={CheckCircleIcon}
          color='var(--pf-t--global--icon--color--status--success--default)'
          value={subtotals?.patched}
          apply={apply}
          filter={{ filter: { packages_updatable: 'eq:0', stale: false } }} // TODO: remove `stale: false` once default filter is gone
        />
        <StatusCard
          title={intl.formatMessage(messages.labelsStatusSystemsWithPatchesAvailable)}
          Icon={BundleIcon}
          value={subtotals?.unpatched}
          apply={apply}
          filter={{ filter: { packages_updatable: 'gt:0', stale: false } }} // TODO: remove `stale: false` once default filter is gone
        />
        <StatusCard
          title={intl.formatMessage(messages.labelsStatusStaleSystems)}
          Icon={ExclamationTriangleIcon}
          color='var(--pf-t--global--icon--color--status--warning--default)'
          value={subtotals?.stale}
          apply={apply}
          filter={{ filter: { stale: true } }}
        />
      </Grid>
    </Main>
  );
};

StatusCard.propTypes = {
  title: propTypes.string,
  Icon: propTypes.elementType,
  value: propTypes.number,
  color: propTypes.string,
  apply: propTypes.func,
  filter: propTypes.object,
};

SystemsStatusReport.propTypes = {
  apply: propTypes.func,
  queryParams: propTypes.object,
};

export default SystemsStatusReport;
