import { BugIcon, EnhancementIcon, FlagIcon, SecurityIcon } from '@patternfly/react-icons';
import React from 'react';
import { subtractDate } from './Helpers';

export const STATUS_REJECTED = 'rejected';
export const STATUS_LOADING = 'loading';
export const STATUS_RESOLVED = 'resolved';

export const defaultCompoundSortValues = {
  operating_system: {
    asc: 'osname,osmajor,osminor',
    desc: '-osname,-osmajor,-osminor',
  },
  applicable_advisories: {
    asc: 'rhsa_count,rhba_count,rhea_count',
    desc: '-rhsa_count,-rhba_count,-rhea_count',
  },
};

export const templateCompoundSortValues = {
  applicable_advisories: {
    asc: 'applicable_rhsa_count,applicable_rhba_count,applicable_rhea_count',
    desc: '-applicable_rhsa_count,-applicable_rhba_count,-applicable_rhea_count',
  },
  installable_advisories: {
    asc: 'installable_rhsa_count,installable_rhba_count,installable_rhea_count',
    desc: '-installable_rhsa_count,-installable_rhba_count,-installable_rhea_count',
  },
};

export const storeListDefaults = {
  rows: [],
  status: { isLoading: true },
  metadata: {
    limit: 25,
    offset: 0,
    total_items: 0,
  },
  expandedRows: {},
  selectedRows: {},
  queryParams: {
    page: 1,
    page_size: 20,
  },
  error: {},
};

export const systemPackagesDefaultFilters = {
  filter: { update_status: ['Installable'] },
};

export const packagesListDefaultFilters = {
  filter: { systems_applicable: ['gt:0'] },
};

export const systemsListDefaultFilters = {
  filter: { stale: [true, false] },
};

export const publicDateOptions = [
  {
    apiValue: `gt:${subtractDate(7)}`,
    label: 'Last 7 days',
    value: 'last7',
  },
  {
    apiValue: `gt:${subtractDate(30)}`,
    label: 'Last 30 days',
    value: 'last30',
  },
  {
    apiValue: `gt:${subtractDate(90)}`,
    label: 'Last 90 days',
    value: 'last90',
  },
  {
    apiValue: `gt:${subtractDate(365)}`,
    label: 'Last year',
    value: 'lastYear',
  },
  {
    apiValue: `lt:${subtractDate(365)}`,
    label: 'More than 1 year ago',
    value: 'moreThanYear',
  },
];

export const advisorySeverities = [
  {
    value: null,
    label: 'None',
    color: 'var(--pf-t--global--icon--color--severity--minor--default)',
  },
  {
    value: 1,
    label: 'Low',
    color: 'var(--pf-t--global--icon--color--severity--minor--default)',
    text:
      'This rating is given to all other issues that have a security impact. These are the types of vulnerabilities' +
      ' that are believed to require unlikely circumstances to be able to be exploited, or where a successful exploit' +
      ' would give minimal consequences.',
  },
  {
    value: 2,
    label: 'Moderate',
    color: 'var(--pf-t--global--icon--color--severity--moderate--default)',
    text:
      'This rating is given to flaws that may be more difficult to exploit but could still lead to some' +
      ' compromise of the confidentiality, integrity, or availability of resources, under certain circumstances.' +
      ' These are the types of vulnerabilities that could have had a Critical impact or Important impact' +
      ' but are less easily exploited based on a technical evaluation of the flaw, or affect unlikely' +
      ' configurations.',
  },
  {
    value: 3,
    label: 'Important',
    color: 'var(--pf-t--global--icon--color--severity--important--default)',
    text:
      'This rating is given to flaws that can easily compromise the confidentiality, integrity, or availability' +
      ' of resources. These are the types of vulnerabilities that allow local users to gain privileges, allow' +
      ' unauthenticated remote users to view resources that should otherwise be protected by authentication,' +
      ' allow authenticated remote users to execute arbitrary code, or allow remote users to cause a denial' +
      ' of service.',
  },
  {
    value: 4,
    label: 'Critical',
    color: 'var(--pf-t--global--icon--color--severity--critical--default)',
    text:
      'This rating is given to flaws that could be easily exploited by a remote unauthenticated attacker' +
      ' and lead to system compromise (arbitrary code execution) without requiring user interaction.' +
      ' These are the types of vulnerabilities that can be exploited by worms. Flaws that require an authenticated' +
      ' remote user, a local user, or an unlikely configuration are not classed as Critical impact.',
  },
];

export const advisoryTypes = [
  {
    value: 'security',
    label: 'Security',
    icon: <SecurityIcon />,
  },
  {
    value: 'bugfix',
    label: 'Bugfix',
    icon: <BugIcon />,
  },
  {
    value: 'enhancement',
    label: 'Enhancement',
    icon: <EnhancementIcon />,
  },
  {
    value: 'other',
    label: 'Other',
    icon: <FlagIcon />,
  },
];

export const updatableTypes = [
  {
    value: 'None',
    label: 'Up to date',
  },
  {
    value: 'Installable',
    label: 'Installable',
  },
  {
    value: 'Applicable',
    label: 'Applicable',
  },
];

export const advisoryStatuses = [
  {
    value: 'Installable',
    label: 'Installable',
  },
  {
    value: 'Applicable',
    label: 'Applicable',
  },
];

export const packagesListUpdatableTypes = [
  {
    value: 'eq:0',
    label: 'Systems up to date',
  },
  {
    value: 'gt:0',
    label: 'Systems with patches available',
  },
];

export const staleSystems = [
  {
    value: true,
    label: 'Stale',
  },
  {
    value: false,
    label: 'Fresh',
  },
];

export const rebootRequired = [
  {
    value: true,
    label: 'Required',
  },
  {
    value: false,
    label: 'Not required',
  },
];

export const filterCategories = {
  advisory_type_name: {
    label: 'Advisory type',
    values: advisoryTypes,
  },
  severity: {
    label: 'Severity',
    values: advisorySeverities,
  },
  public_date: {
    label: 'Public date',
    values: publicDateOptions,
  },
  update_status: {
    label: 'Status',
    values: updatableTypes,
  },
  systems_applicable: {
    label: 'Status',
    values: packagesListUpdatableTypes,
  },
  packages_updatable: {
    label: 'Patch status',
    values: packagesListUpdatableTypes,
  },
  stale: {
    label: 'Status',
    values: staleSystems,
  },
  reboot_required: {
    label: 'Reboot',
    values: rebootRequired,
  },
  os: {
    label: 'Operating system',
  },
  creator: {
    label: 'Creator',
  },
  status: {
    label: 'Status',
    values: advisoryStatuses,
  },
  group_name: {
    label: 'Group',
  },
};

export const entityTypes = {
  advisories: 'advisories',
  packages: 'packages',
};

export const ReadOnlyNotification = {
  title: 'title',
  detail: 'message',
};

export const remediationIdentifiers = {
  package: 'patch-package',
  advisory: 'patch-advisory',
};

export const exportNotifications = (format) => ({
  pending: {
    title: `Preparing export of ${format?.toUpperCase()} format. Once complete, your download will start automatically.`,
    variant: 'info',
  },
  success: {
    title: `The exported ${format?.toUpperCase()} file is being downloaded`,
    variant: 'success',
  },
  error: {
    title: 'Couldn’t download export. Reinitiate this export to try again.',
    variant: 'danger',
  },
});

export const multiValueFilters = ['installed_evra', 'os', 'creator', 'status', 'group_name'];

export const featureFlags = {
  patch_set: 'patch.patch_set',
};

export const NO_ADVISORIES_TEXT =
  'There is no installable content that can be remediated with Ansible for selected systems.';
