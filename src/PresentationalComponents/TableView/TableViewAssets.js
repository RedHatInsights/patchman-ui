import { cellWidth, expandable, sortable } from '@patternfly/react-table';
import messages from '../../Messages';
import { intl } from '../../Utilities/IntlProvider';

export const advisoriesColumns = [
  {
    title: intl.formatMessage(messages.labelsColumnsName),
    cellFormatters: [expandable],
    transforms: [sortable, cellWidth(15)],
    key: 'id',
    isShown: true,
    isShownByDefault: true,
    isUntoggleable: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsSynopsis),
    transforms: [sortable],
    key: 'synopsis',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsType),
    transforms: [sortable, cellWidth(10)],
    key: 'advisory_type_name',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsSeverity),
    transforms: [sortable, cellWidth(10)],
    key: 'severity',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsAffectedSystems),
    transforms: [sortable, cellWidth(15)],
    key: 'applicable_systems',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsReboot),
    transforms: [sortable],
    key: 'reboot_required',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsPublishDate),
    transforms: [sortable, cellWidth(15)],
    key: 'public_date',
    isShown: true,
    isShownByDefault: true,
  },
];

export const systemAdvisoriesColumns = [
  {
    title: intl.formatMessage(messages.labelsColumnsName),
    cellFormatters: [expandable],
    transforms: [sortable, cellWidth(15)],
    key: 'id',
    isShown: true,
    isShownByDefault: true,
    isUntoggleable: true,
  },
  {
    title: 'Synopsis',
    transforms: [sortable, cellWidth(35)],
    key: 'synopsis',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsStatus),
    transforms: [sortable, cellWidth(10)],
    key: 'status',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsType),
    transforms: [sortable, cellWidth(10)],
    key: 'advisory_type_name',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsSeverity),
    transforms: [sortable, cellWidth(10)],
    key: 'severity',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsReboot),
    transforms: [sortable, cellWidth(10)],
    key: 'reboot_required',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsPublishDate),
    transforms: [sortable, cellWidth(10)],
    key: 'public_date',
    isShown: true,
    isShownByDefault: true,
  },
];

export const systemPackagesColumns = [
  {
    title: intl.formatMessage(messages.labelsColumnsName),
    transforms: [sortable, cellWidth(20)],
    key: 'name',
    isShown: true,
    isShownByDefault: true,
    isUntoggleable: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsInstalledVersion),
    transforms: [sortable, cellWidth(15)],
    key: 'evra',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsLatestInstallableVersion),
    transforms: [cellWidth(15)],
    key: 'latest_installable_version',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsLatestApplicableVersion),
    transforms: [cellWidth(15)],
    key: 'latest_applicable_version',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsStatus),
    transforms: [sortable, cellWidth(10)],
    key: 'update_status',
    isShown: true,
    isShownByDefault: true,
  },
  {
    title: intl.formatMessage(messages.labelsColumnsSummary),
    transforms: [sortable, cellWidth(40)],
    key: 'summary',
    isShown: true,
    isShownByDefault: true,
  },
];

export const packagesColumns = [
  {
    key: 'name',
    title: intl.formatMessage(messages.labelsColumnsName),
    transforms: [sortable, cellWidth(25)],
    isShown: true,
    isShownByDefault: true,
    isUntoggleable: true,
  },
  {
    key: 'systems_installed',
    title: intl.formatMessage(messages.labelsColumnsInstalledSystems),
    transforms: [sortable, cellWidth(10)],
    props: {
      width: 10,
    },
    isShown: true,
    isShownByDefault: true,
  },
  {
    key: 'systems_applicable',
    title: intl.formatMessage(messages.labelsColumnsApplicableSystems),
    transforms: [sortable, cellWidth(10)],
    props: {
      width: 10,
    },
    isShown: true,
    isShownByDefault: true,
  },
  {
    key: 'systems_installable',
    title: intl.formatMessage(messages.labelsColumnsInstallableSystems),
    transforms: [sortable, cellWidth(10)],
    props: {
      width: 10,
    },
    isShown: true,
    isShownByDefault: true,
  },
  {
    key: 'summary',
    title: intl.formatMessage(messages.labelsColumnsSummary),
    transforms: [sortable, cellWidth(40)],
    props: {
      width: 30,
    },
    isShown: true,
    isShownByDefault: true,
  },
];

export const cvesTableColumns = [
  {
    title: intl.formatMessage(messages.labelsColumnsCveID),
    transforms: [sortable, cellWidth(40)],
    key: 'synopsis',
  },
  {
    key: 'impact',
    title: intl.formatMessage(messages.labelsColumnsSeverity),
    transforms: [sortable, cellWidth(30)],
    props: {
      width: 30,
    },
  },
  {
    key: 'cvss',
    title: intl.formatMessage(messages.labelsColumnsCVSS),
    transforms: [sortable, cellWidth(30)],
    props: {
      width: 30,
    },
  },
];
