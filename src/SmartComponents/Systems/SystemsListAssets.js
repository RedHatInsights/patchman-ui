import React, { useCallback } from 'react';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
  createAdvisoriesIcons,
  createUpgradableColumn,
  remediationProvider,
  createOSColumn,
  createPackagesColumn,
} from '../../Utilities/Helpers';
import { sortable, wrappable, nowrap } from '@patternfly/react-table';
import { InsightsLink } from '@redhat-cloud-services/frontend-components/InsightsLink';
import { Content, Tooltip } from '@patternfly/react-core';
import { useFetchBatched } from '../../Utilities/hooks';

export const ManagedBySatelliteCell = () => (
  <Tooltip content='This system is managed by Satellite and does not use a template.'>
    <Content>
      <Content component='p' className='pf-v6-u-font-size-sm'>
        Managed by Satellite
      </Content>
    </Content>
  </Tooltip>
);

export const SYSTEMS_LIST_COLUMNS = [
  {
    key: 'display_name',
    title: 'Name',
    transforms: [wrappable],
    renderFunc: (displayName, id) => (
      <InsightsLink to={`/systems/${id}`}>{displayName}</InsightsLink>
    ),
  },
  {
    key: 'groups',
    title: 'Workspace',
    transforms: [wrappable],
  },
  {
    key: 'tags',
    title: 'Tags',
    transforms: [wrappable],
  },
  {
    key: 'operating_system',
    title: 'OS',
    transforms: [wrappable],
    renderFunc: (value) => createOSColumn(value),
  },
  {
    key: 'template_name',
    title: 'Template',
    transforms: [wrappable],
    renderFunc: (value, _, row) =>
      row.satellite_managed ? (
        <ManagedBySatelliteCell />
      ) : value ? (
        <InsightsLink app='content' to={{ pathname: `/templates/${row.template_uuid}` }}>
          {value}
        </InsightsLink>
      ) : (
        'No template'
      ),
  },
  {
    key: 'applicable_advisories',
    title: 'Installable advisories',
    transforms: [wrappable],
    renderFunc: (value) => createAdvisoriesIcons(value, 'installable'),
  },
  {
    key: 'packages_installed',
    title: 'Installed packages',
    transforms: [wrappable],
    renderFunc: (packageCount, systemID) => createPackagesColumn(packageCount, systemID),
  },
  {
    inventoryKey: 'updated',
    key: 'last_upload',
    transforms: [nowrap],
    sortKey: 'last_upload',
  },
];

export const ADVISORY_SYSTEMS_COLUMNS = [
  {
    key: 'display_name',
    title: 'Name',
    transforms: [wrappable],
    renderFunc: (displayName, id) => (
      <InsightsLink to={`/systems/${id}`}>{displayName}</InsightsLink>
    ),
  },
  {
    key: 'groups',
    title: 'Workspace',
    transforms: [wrappable],
  },
  {
    key: 'tags',
    title: 'Tags',
    transforms: [wrappable],
  },
  {
    key: 'os',
    title: 'OS',
    transforms: [wrappable],
    renderFunc: (value) => createOSColumn(value),
  },
  {
    key: 'template_name',
    title: 'Template',
    transforms: [wrappable],
    renderFunc: (value, _, row) =>
      row.satellite_managed ? (
        <ManagedBySatelliteCell />
      ) : value ? (
        <InsightsLink app='content' to={{ pathname: `/templates/${row.template_uuid}` }}>
          {value}
        </InsightsLink>
      ) : (
        'No template'
      ),
  },
  {
    key: 'status',
    title: 'Status',
    props: {
      isStatic: true,
    },
    transforms: [sortable, wrappable],
  },
  {
    inventoryKey: 'updated',
    key: 'last_upload',
    transforms: [nowrap],
    sortKey: 'last_upload',
  },
];

export const PACKAGE_SYSTEMS_COLUMNS = [
  {
    key: 'display_name',
    title: 'Name',
    transforms: [wrappable],
  },
  {
    key: 'groups',
    title: 'Workspace',
    transforms: [wrappable],
  },
  {
    key: 'tags',
    title: 'Tags',
    transforms: [wrappable],
  },
  {
    key: 'os',
    title: 'OS',
    transforms: [wrappable],
    renderFunc: (value) => createOSColumn(value),
  },
  {
    key: 'template_name',
    title: 'Template',
    transforms: [wrappable],
    renderFunc: (value, _, row) =>
      row.satellite_managed ? (
        <ManagedBySatelliteCell />
      ) : value ? (
        <InsightsLink app='content' to={{ pathname: `/templates/${row.template_uuid}` }}>
          {value}
        </InsightsLink>
      ) : (
        'No template'
      ),
  },
  {
    key: 'installed_evra',
    title: 'Installed version',
    transforms: [wrappable],
  },
  {
    key: 'available_evra',
    title: 'Latest version',
    transforms: [wrappable],
  },
  {
    key: 'update_status',
    title: 'Status',
    transforms: [wrappable],
    renderFunc: (value) => createUpgradableColumn(value),
  },
];

const isRemediationDisabled = (row) => {
  const { status } = row?.attributes || {};
  const { applicable_advisories: applicableAdvisories } = row || {};

  return (
    (applicableAdvisories && applicableAdvisories.every((typeSum) => typeSum === 0)) ||
    status === 'Applicable'
  );
};

export const useActivateRemediationModal = (setRemediationIssues, setRemediationOpen) => {
  const { fetchBatched } = useFetchBatched();

  return useCallback(async (rowData) => {
    const filter = {
      id: rowData.id,
      'filter[status]': 'in:Installable',
    };

    const totalCount = await fetchApplicableSystemAdvisoriesApi({ ...filter, limit: 1 }).then(
      (response) => response?.meta?.total_items || 0,
    );

    fetchBatched(
      (filterWithPagination) => fetchApplicableSystemAdvisoriesApi(filterWithPagination),
      filter,
      totalCount,
    )
      .then((response) => {
        const advisories = response.flatMap(({ data }) => data);
        const remediationIssues = remediationProvider(
          advisories.map((item) => item.id),
          rowData.id,
          remediationIdentifiers.advisory,
        );

        setRemediationIssues(remediationIssues);

        setRemediationOpen(true);
      })
      .catch(() => {
        setRemediationOpen(false);
      });
  }, []);
};

export const systemsRowActions = (activateRemediationModal, row) => [
  {
    title: 'Apply all applicable advisories',
    isDisabled: isRemediationDisabled(row),
    onClick: (event, rowId, rowData) => {
      activateRemediationModal(rowData);
    },
  },
];
