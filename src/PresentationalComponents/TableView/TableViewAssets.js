import { expandable, sortable, wrappable, nowrap } from '@patternfly/react-table';
import messages from '../../Messages';
import { intl } from '../../Utilities/IntlProvider';

export const advisoriesColumns = [
  {
    title: intl.formatMessage(messages.labelsColumnsName),
    cellFormatters: [expandable],
    transforms: [sortable, wrappable],
    key: 'id',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsSynopsis),
    transforms: [sortable, nowrap],
    key: 'synopsis',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsType),
    transforms: [sortable, wrappable],
    key: 'advisory_type_name',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsSeverity),
    transforms: [sortable, wrappable],
    key: 'severity',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsAffectedSystems),
    transforms: [sortable, wrappable],
    key: 'applicable_systems',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsReboot),
    transforms: [sortable, wrappable],
    key: 'reboot_required',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsPublishDate),
    transforms: [sortable, wrappable],
    key: 'public_date',
  },
];

export const systemAdvisoriesColumns = [
  {
    title: intl.formatMessage(messages.labelsColumnsName),
    cellFormatters: [expandable],
    transforms: [sortable, wrappable],
    key: 'id',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsSynopsis),
    transforms: [sortable, nowrap],
    key: 'synopsis',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsStatus),
    transforms: [sortable, wrappable],
    key: 'status',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsType),
    transforms: [sortable, wrappable],
    key: 'advisory_type_name',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsSeverity),
    transforms: [sortable, wrappable],
    key: 'severity',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsReboot),
    transforms: [sortable, wrappable],
    key: 'reboot_required',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsPublishDate),
    transforms: [sortable, wrappable],
    key: 'public_date',
  },
];

export const systemPackagesColumns = [
  {
    title: intl.formatMessage(messages.labelsColumnsName),
    transforms: [sortable, wrappable],
    key: 'name',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsInstalledVersion),
    transforms: [sortable, wrappable],
    key: 'evra',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsLatestInstallableVersion),
    transforms: [wrappable],
    key: 'latest_installable_version',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsLatestApplicableVersion),
    transforms: [wrappable],
    key: 'latest_applicable_version',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsStatus),
    transforms: [sortable, wrappable],
    key: 'update_status',
  },
  {
    title: intl.formatMessage(messages.labelsColumnsSummary),
    transforms: [sortable, wrappable],
    key: 'summary',
  },
];

export const packagesColumns = [
  {
    key: 'name',
    title: intl.formatMessage(messages.labelsColumnsName),
    transforms: [sortable, wrappable],
  },
  {
    key: 'systems_installed',
    title: intl.formatMessage(messages.labelsColumnsInstalledSystems),
    transforms: [sortable, wrappable],
    props: {
      width: 10,
    },
  },
  {
    key: 'systems_applicable',
    title: intl.formatMessage(messages.labelsColumnsApplicableSystems),
    transforms: [sortable, wrappable],
    props: {
      width: 10,
    },
  },
  {
    key: 'systems_installable',
    title: intl.formatMessage(messages.labelsColumnsInstallableSystems),
    transforms: [sortable, wrappable],
    props: {
      width: 10,
    },
  },
  {
    key: 'summary',
    title: intl.formatMessage(messages.labelsColumnsSummary),
    transforms: [sortable, wrappable],
    props: {
      width: 30,
    },
  },
];

export const cvesTableColumns = [
  {
    title: intl.formatMessage(messages.labelsColumnsCveID),
    transforms: [sortable, nowrap],
    key: 'synopsis',
  },
  {
    key: 'impact',
    title: intl.formatMessage(messages.labelsColumnsSeverity),
    transforms: [sortable],
    props: {
      width: 30,
    },
  },
  {
    key: 'cvss',
    title: intl.formatMessage(messages.labelsColumnsCVSS),
    transforms: [sortable],
    props: {
      width: 30,
    },
  },
];
