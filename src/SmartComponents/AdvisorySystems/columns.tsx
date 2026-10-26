import React from 'react';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';
import type { OperatingSystemValue, SystemsViewProps } from '../../SystemsView';
import { ManagedBySatelliteCell } from '../Systems/SystemsListAssets';
import type { AdvisorySystem } from './types';

type AdvisorySystemsColumns = SystemsViewProps<AdvisorySystem>['columns'];

interface TemplateCellValue {
  name?: string;
  uuid?: string;
  satelliteManaged?: boolean;
}

const toOperatingSystemValue = (os?: string, rhsm?: string): OperatingSystemValue => {
  const match = os?.match(/^(RHEL|CentOS Linux|CentOS) (\d+)\.(\d+)$/);
  if (!match) {
    return { name: os, rhsm };
  }
  return {
    name: match[1],
    major: Number(match[2]),
    minor: Number(match[3]),
    rhsm,
  };
};

const columns: AdvisorySystemsColumns = (catalog) => [
  catalog.name({
    getValue(item) {
      return {
        id: item.id,
        displayName: item.attributes?.display_name,
      };
    },
  }),
  catalog.workspace({
    sortBy: 'groups',
    getValue(item) {
      return item.attributes?.groups;
    },
  }),
  catalog.tags({
    getValue: (item) => ({
      id: item.id,
      display_name: item.attributes?.display_name,
      tags: item?.attributes?.tags,
    }),
  }),
  catalog.os({
    sortBy: 'os',
    getValue: (item) => toOperatingSystemValue(item.attributes?.os, item.attributes?.rhsm),
  }),
  catalog.custom<AdvisorySystem, TemplateCellValue>(
    {
      key: 'template_name',
      title: 'Template',
      appName: 'content',
      sortBy: 'template_name',
      renderCell: (value) =>
        value.satelliteManaged ? (
          <ManagedBySatelliteCell />
        ) : value.name ? (
          <InsightsLink app='content' preview={false} to={{ pathname: `/templates/${value.uuid}` }}>
            {value.name}
          </InsightsLink>
        ) : (
          'No template'
        ),
    },
    {
      getValue: (item) => ({
        name: item.attributes?.template_name,
        uuid: item.attributes?.template_uuid,
        satelliteManaged: item.attributes?.satellite_managed,
      }),
    },
  ),
  catalog.custom<AdvisorySystem, string | undefined>(
    {
      key: 'status',
      title: 'Status',
      appName: 'content',
      sortBy: 'status',
      renderCell: (value) => value,
    },
    {
      getValue: (item) => item.attributes?.status,
    },
  ),
  catalog.lastSeen({
    sortBy: 'last_upload',
    getValue: (item) => ({
      lastSeen: item.attributes?.last_upload,
      culled: item.attributes?.culled_timestamp,
      staleWarning: item.attributes?.stale_warning_timestamp,
      stale: item.attributes?.stale_timestamp,
    }),
  }),
];

export default columns;
