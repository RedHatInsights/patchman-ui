/* eslint sort-keys: ["error", "asc", {minKeys: 4}] */

import { defineMessages } from 'react-intl';

export default defineMessages({
  generalAppName: {
    id: 'generalAppName',
    description: 'regsiter page title',
    defaultMessage: 'Patch',
  },
  labelsAffectedSystemsCount: {
    id: 'labelsAffectedSystemsCount',
    description: 'applicable systems number label',
    defaultMessage: '{systemsCount} affected systems',
  },
  labelsBulkSelectAll: {
    id: 'labelsBulkSelectAll',
    description: 'bulk select option',
    defaultMessage: 'Select all ({count})',
  },
  labelsBulkSelectNone: {
    id: 'labelsBulkSelectNone',
    description: 'bulk select option',
    defaultMessage: 'Select none (0)',
  },
  labelsBulkSelectPage: {
    id: 'labelsBulkSelectPage',
    description: 'bulk select option',
    defaultMessage: 'Select page ({count})',
  },
  labelsColumnsAffectedSystems: {
    id: 'labelsColumnsAffectedSystems',
    description: 'shared label',
    defaultMessage: 'Affected systems',
  },
  labelsColumnsApplicableSystems: {
    id: 'labelsColumnsApplicableSystems',
    description: 'shared label',
    defaultMessage: 'Applicable systems',
  },
  labelsColumnsCVSS: {
    id: 'labelsColumnsCVSS',
    description: 'shared label',
    defaultMessage: 'CVSS',
  },
  labelsColumnsCveID: {
    id: 'labelsColumnsCveID',
    description: 'shared label',
    defaultMessage: 'CVE ID',
  },
  labelsColumnsInstallableSystems: {
    id: 'labelsColumnsApplicableSystems',
    description: 'shared label',
    defaultMessage: 'Installable systems',
  },
  labelsColumnsInstalledSystems: {
    id: 'labelsColumnsApplicableSystems',
    description: 'shared label',
    defaultMessage: 'Installed systems',
  },
  labelsColumnsInstalledVersion: {
    id: 'labelsColumnsInstalledVersion',
    description: 'shared label',
    defaultMessage: 'Installed version',
  },
  labelsColumnsLatestApplicableVersion: {
    id: 'labelsColumnsLatestApplicableVersion',
    description: 'shared label',
    defaultMessage: 'Latest applicable version',
  },
  labelsColumnsLatestInstallableVersion: {
    id: 'labelsColumnsLatestInstallableVersion',
    description: 'shared label',
    defaultMessage: 'Installable version',
  },
  labelsColumnsName: {
    id: 'labelsColumnsName',
    description: 'shared label',
    defaultMessage: 'Name',
  },
  labelsColumnsPublishDate: {
    id: 'labelsColumnsPublishDate',
    description: 'shared label',
    defaultMessage: 'Publish date',
  },
  labelsColumnsReboot: {
    id: 'labelsColumnsRebootRequired',
    description: 'shared label',
    defaultMessage: 'Reboot',
  },
  labelsColumnsSeverity: {
    id: 'labelsColumnsSeverity',
    description: 'shared label',
    defaultMessage: 'Severity',
  },
  labelsColumnsStatus: {
    id: 'labelsColumnsStatus',
    description: 'Label for status filter',
    defaultMessage: 'Status',
  },
  labelsColumnsStatusPlaceholder: {
    id: 'labelsColumnsStatus',
    description: 'Label for status filter placeholder',
    defaultMessage: 'Filter by status',
  },
  labelsColumnsSummary: {
    id: 'labelsColumnsSummary',
    description: 'shared label',
    defaultMessage: 'Summary',
  },
  labelsColumnsSynopsis: {
    id: 'labelsColumnsSynopsis',
    description: 'shared label',
    defaultMessage: 'Synopsis',
  },
  labelsColumnsTemplate: {
    id: 'labelsColumnsTemplate',
    description: 'Label for patch template column',
    defaultMessage: 'Template',
  },
  labelsColumnsType: {
    id: 'labelsColumnsType',
    description: 'Label for type filter placeholder',
    defaultMessage: 'Type',
  },
  labelsColumnsUpToApplicable: {
    id: 'labelsColumnsUpToApplicable',
    description: 'shared label',
    defaultMessage: 'Up to applicable version',
  },
  labelsColumnsUpToInstallable: {
    id: 'labelsColumnsUpToInstallable',
    description: 'shared label',
    defaultMessage: 'Up to latest installable version',
  },
  labelsColumnsUpgradable: {
    id: 'labelsColumnsUpgradable',
    description: 'shared label',
    defaultMessage: 'Upgradable',
  },
  labelsCves: {
    id: 'labelsCves',
    description: 'label for cves info link',
    defaultMessage: 'CVEs',
  },
  labelsCvesButton: {
    id: 'labelsCvesButton',
    description: 'label for cves button',
    defaultMessage: '{cvesCount, plural, one {# CVE} other {# CVEs}} associated with this patch',
  },
  labelsDate: {
    id: 'labelsDate',
    description: 'Label',
    defaultMessage: 'Date',
  },
  labelsDescription: {
    id: 'labelsDescription',
    description: 'Label',
    defaultMessage: 'Description',
  },
  labelsDocumentation: {
    id: 'labelsDocumentation',
    description: 'Documentation link text',
    defaultMessage: 'Documentation',
  },
  labelsFiltersClear: {
    id: 'labelsFiltersClear',
    description: 'label for remove filter chips',
    defaultMessage: 'Reset filters',
  },
  labelsFiltersCvesSearchPlaceHolder: {
    id: 'labelsFiltersCvesSearch',
    description: 'search filter placeholder for packages pages',
    defaultMessage: 'Filter by CVE ID',
  },
  labelsFiltersOsVersion: {
    id: 'labelsFiltersOsVersion',
    description: 'filter for systems pages',
    defaultMessage: 'Operating system',
  },
  labelsFiltersOsVersionPlaceholder: {
    id: 'labelsFiltersOsVersionPlaceholder',
    description: 'filter for systems pages',
    defaultMessage: 'Filter by operating system',
  },
  labelsFiltersPackageVersionPlaceholder: {
    id: 'labelFiltersPackageVersionPlaceholder',
    description: 'Label for version filter placeholder',
    defaultMessage: 'Filter by version',
  },
  labelsFiltersPackageVersionTitle: {
    id: 'labelsFiltersPackageVersionTitle',
    description: 'Label for version filter title',
    defaultMessage: 'Version',
  },
  labelsFiltersPackagesSearchPlaceHolder: {
    id: 'labelsFiltersPackagesSearchPlaceHolder',
    description: 'search filter placeholder for packages pages',
    defaultMessage: 'Filter by name or summary',
  },
  labelsFiltersPackagesSearchTitle: {
    id: 'labelsFiltersPackagesSearchTitle',
    description: 'search filter placeholder for packages pages',
    defaultMessage: 'Package',
  },
  labelsFiltersPublishDate: {
    id: 'labelsFiltersPublishDate',
    description: 'shared label',
    defaultMessage: 'Publish date',
  },
  labelsFiltersPublishDatePlaceholder: {
    id: 'labelsFiltersPublishDate',
    description: 'shared placeholder label',
    defaultMessage: 'Filter by publish date',
  },
  labelsFiltersReboot: {
    id: 'labelsFiltersReboot',
    description: 'label for reboot filter chips',
    defaultMessage: 'Reboot',
  },
  labelsFiltersRebootPlaceholder: {
    id: 'labelsFiltersRebootPlaceholder',
    description: 'placeholder for reboot filter chips',
    defaultMessage: 'Filter by reboot',
  },
  labelsFiltersReset: {
    id: 'labelsFiltersReset',
    description: 'label for remove filter chips',
    defaultMessage: 'Reset filters',
  },
  labelsFiltersSearchAdvisoriesPlaceholder: {
    id: 'labelsFiltersSearchAdvisoriesPlaceholder',
    description: 'Label for search filter placeholder',
    defaultMessage: 'Filter by name or synopsis',
  },
  labelsFiltersSearchAdvisoriesTitle: {
    id: 'labelsFiltersSearchAdvisoriesTitle',
    description: 'Label for search filter placeholder',
    defaultMessage: 'Advisory',
  },
  labelsFiltersSeverity: {
    id: 'labelsFiltersSeverity',
    description: 'Label for severity filter',
    defaultMessage: 'Severity',
  },
  labelsFiltersSeverityPlaceholder: {
    id: 'labelsFiltersSeverity',
    description: 'Label for severity filter placeholder',
    defaultMessage: 'Filter by severity',
  },
  labelsFiltersStale: {
    id: 'labelsFiltersStale',
    description: 'Label for stale filter title',
    defaultMessage: 'Status',
  },
  labelsFiltersStalePlaceholder: {
    id: 'labelsFiltersStalePlaceholder',
    description: 'Label for stale filter placeholder',
    defaultMessage: 'Filter by status',
  },
  labelsFiltersStatus: {
    id: 'labelsFiltersStatus',
    description: 'Label for status filter placeholder',
    defaultMessage: 'Status',
  },
  labelsFiltersSystemsSearchPlaceholder: {
    id: 'labelsFiltersSystemsSearch',
    description: 'search filter placeholder for systems pages',
    defaultMessage: 'Filter by name',
  },
  labelsFiltersSystemsSearchTitle: {
    id: 'labelsFiltersSystemsSearchTitle',
    description: 'search filter placeholder for systems pages',
    defaultMessage: 'System',
  },
  labelsFiltersType: {
    id: 'labelsFiltersType',
    description: 'Label for type filter',
    defaultMessage: 'Type',
  },
  labelsFiltersTypePlaceholder: {
    id: 'labelsFiltersType',
    description: 'Label for type filter placeholder',
    defaultMessage: 'Filter by type',
  },
  labelsFiltersUpdatable: {
    id: 'labelsFiltersUpdatable',
    description: 'search filter placeholder for systems pages',
    defaultMessage: 'Patch status',
  },
  labelsFiltersUpdatablePlaceholder: {
    id: 'labelsFiltersUpdatablePlaceholder',
    description: 'search filter placeholder for systems updatable pages',
    defaultMessage: 'Filter by patch status',
  },
  labelsModifiedDate: {
    id: 'labelsModifiedDate',
    description: 'Modified date label',
    defaultMessage: 'Modified {date}',
  },
  labelsNotAuthorizedDescription: {
    id: 'notAuthorizedDescription',
    description:
      "Description for component which shows up when user doesn't have permission to view content",
    defaultMessage: 'Contact your organization administrator(s) for more information.',
  },
  labelsNotAuthorizedTitle: {
    id: 'notAuthorizedTitle',
    description:
      "Title for component which shows up when user doesn't have permission to view content",
    defaultMessage: 'You do not have permissions to view or manage Patch',
  },
  labelsPublicDate: {
    id: 'labelsPublicDate',
    description: 'Public date label',
    defaultMessage: 'Issued {date}',
  },
  labelsRebootNotRequired: {
    id: 'labelsRequired',
    description: 'shared label',
    defaultMessage: 'Not required',
  },
  labelsRebootRequired: {
    id: 'labelsRequired',
    description: 'shared label',
    defaultMessage: 'Required',
  },
  labelsRemediate: {
    id: 'labelsRemediate',
    description: 'Button label',
    defaultMessage: 'Plan remediation',
  },
  labelsReturnToLandingPage: {
    id: 'returnToLandingPage',
    description: 'Return to landing page label for general usage',
    defaultMessage: 'Go to landing page',
  },
  labelsReturnToPreviousPage: {
    id: 'returnPreviousPage',
    description: 'Return to previous page label for general usage',
    defaultMessage: 'Return to previous page',
  },
  labelsSeverity: {
    id: 'labelsSeverity',
    description: 'label for cves info',
    defaultMessage: 'Severity',
  },
  labelsStatusStaleSystems: {
    id: 'labelsStatusStaleSystems',
    description: 'Label for status report',
    defaultMessage: 'Stale systems',
  },
  labelsStatusSystemsUpToDate: {
    id: 'labelsSystemsUpToDate',
    description: 'Label for status report',
    defaultMessage: 'Systems up to date',
  },
  labelsStatusSystemsWithPatchesAvailable: {
    id: 'labelsSystemsWithPatchesAvailable',
    description: 'Label for status report',
    defaultMessage: 'Systems with patches available',
  },
  linksLearnAboutInsights: {
    id: 'linksLearnAboutInsights',
    description: 'no system data page button label',
    defaultMessage: 'Learn about the Insights client',
  },
  linksLearnMore: {
    id: 'linksLearnMore',
    description: 'Learn more',
    defaultMessage: 'Learn more',
  },
  linksReadMore: {
    id: 'linksReadMore',
    description: 'Label',
    defaultMessage: 'Read more',
  },
  linksSearchSecurityRatings: {
    id: 'linksSearchSecurityRatings',
    description: 'A link label to security ratings page',
    defaultMessage: 'Learn more about security ratings',
  },
  linksViewPackagesAndErrata: {
    id: 'viewPackagesAndErrata',
    description: 'A link label to access.redhat.com ',
    defaultMessage: 'View packages and errata at access.redhat.com',
  },
  statesError: {
    id: 'statesError',
    description: 'Label',
    defaultMessage: 'Error',
  },
  statesMinimumPatchPermissionsRequired: {
    id: 'statesMinimumPatchPermissionsRequired',
    description: 'No access page body',
    defaultMessage:
      'To view the content of this page, you must be granted a minimum of Patch permissions from your Organisation Administratior',
  },
  statesNoApplicableAdvisories: {
    id: 'statesNoApplicableAdvisories',
    description: 'system up to date page title',
    defaultMessage: 'No applicable advisories',
  },
  statesNoMatchingAdvisories: {
    id: 'statesNoMatchingAdvisories',
    description: 'Label',
    defaultMessage: 'No matching advisories found',
  },
  statesNoMatchingCve: {
    id: 'statesNoMatchingCve',
    description: 'Label',
    defaultMessage: 'No matching CVES found',
  },
  statesNoMatchingPackages: {
    id: 'statesNoMatchingPackages',
    description: 'Label',
    defaultMessage: 'No matching packages found',
  },
  statesNoTemplateLink: {
    id: 'statesNoTemplateLink',
    description: 'Label',
    defaultMessage: 'Learn more about templates',
  },
  statesRequiresPatchPermissions: {
    id: 'statesRequiresPatchPermissions',
    description: 'No access page title',
    defaultMessage: 'This application requires Patch permissions',
  },
  statesSystemUpToDate: {
    id: 'statesSystemUpToDate',
    description: 'system up to date page body',
    defaultMessage:
      'This system is up to date, based on package information submitted at the most recent system check-in',
  },
  templateContentStepSidebarName: {
    id: 'templateContentStepSidebarName',
    description: 'template wizard template left sidebar label',
    defaultMessage: 'Content',
  },
  templateContentStepText: {
    id: 'templateContentStepText',
    description: 'template wizard template text',
    defaultMessage:
      'Templates provide you with consistent content across environments and time by allowing you to control the scope of package and advisory updates to be installed on selected systems.',
  },
  templateContentStepTitle: {
    id: 'templateContentStepTitle',
    description: 'template wizard template title',
    defaultMessage: 'Define template content',
  },
  templateDetailStepSidebarName: {
    id: 'templateDetailStepSidebarName',
    description: 'template wizard template left sidebar label',
    defaultMessage: 'Details',
  },
  templateDetailStepText: {
    id: 'templateDetailStepText',
    description: 'template wizard template detail step text',
    defaultMessage: 'Enter a name and description for your template.',
  },
  templateDetailStepTitle: {
    id: 'templateDetailStepTitle',
    description: 'template wizard template detail step title',
    defaultMessage: 'Enter template details',
  },
  templateNew: {
    id: 'templateNew',
    description: 'step name of the patch template wizard',
    defaultMessage: 'New patch template ',
  },
  templateNoSystemSelected: {
    id: 'templateNoSystemSelected',
    description: 'validation text of the patch template wizard',
    defaultMessage:
      'At least one system must be selected. Actions must be associated to a system to be added to a playbook.',
  },
  templateStepSystems: {
    id: 'templateStepSystems',
    description: 'step name of the patch template wizard',
    defaultMessage: 'Systems (optional)',
  },
  templateTitleAssignSystem: {
    id: 'templateTitleAssignSystem',
    description: 'title of the patch template wizard',
    defaultMessage: 'Assign system(s) to a patch template ',
  },
  textEmptyStateBody: {
    id: 'textEmptyStateBody',
    description: 'text for the Empty state body',
    defaultMessage: 'To continue, edit your filter settings and search again.',
  },
  textLockVersionTooltip: {
    id: 'textLockVersionTooltip',
    description: 'Tooltip text for vesrion lock column',
    defaultMessage: `Your RHEL version is locked at version {lockedVersion}`,
  },
  textNoVersionAvailable: {
    id: 'textNoVersionAvailable',
    description: 'text to notify there is not available version',
    defaultMessage: 'No version is available',
  },
  textRebootIsRequired: {
    id: 'textRebootIsRequired',
    description: 'Advisories table cell text',
    defaultMessage: 'Reboot is required',
  },
  textUnassignSystemsNoAssignedSystems: {
    id: 'textUnassignSystemsNoAssignedSystems',
    description: 'text about systems being removed',
    defaultMessage:
      'None of the systems you have selected are assigned to existing Patch template.',
  },
  textUnassignSystemsShortTitle: {
    id: 'textUnassignSystemsShortTitle',
    description: 'text about systems being removed',
    defaultMessage: 'Remove system',
  },
  textUnassignSystemsStatement: {
    id: 'textUnassignSystemsStatement',
    description: 'text about systems being removed',
    defaultMessage:
      'Do you want to remove the {systemsCount, plural, one {<b> # </b> selected system } other {<b> # </b> selected systems }} from assigned Patch templates?',
  },
  textUnassignSystemsWarning: {
    id: 'textUnassignSystemsWarning',
    description: 'warning about systems without patch template assigned',
    defaultMessage:
      'There {systemsCount, plural, one {is <b> # </b>  system } other { are <b> # </b>  systems }} you are trying to remove that {systemsCount, plural, one {is} other {are}} not assigned to any existing Patch template. This action will not affect {systemsCount, plural, one {it} other {them}}.',
  },
  titlesAdvisories: {
    id: 'titlesAdvisories',
    description: 'page title with capital letter',
    defaultMessage: 'Advisories',
  },
  titlesAdvisoryType: {
    id: 'titlesAdvisoryType',
    description: 'title with capital letter',
    defaultMessage: 'Advisory type',
  },
  titlesAffectedSystems: {
    id: 'affectedSystems',
    description: 'page title with capital letter',
    defaultMessage: 'Systems',
  },
  titlesMostImpactfulAdvisories: {
    id: 'titlesMostImpactfulAdvisories',
    description: 'page title with capital letter',
    defaultMessage: 'Most impactful advisories',
  },
  titlesPackages: {
    id: 'titlesPackages',
    description: 'page title with capital letters',
    defaultMessage: 'Packages',
  },
  titlesPatchAdvisories: {
    id: 'titlesPatchAdvisories',
    description: 'title for Advisories page',
    defaultMessage: 'Advisories',
  },
  titlesPatchPackages: {
    id: 'titlesPatchPackages',
    description: 'title for Packages page',
    defaultMessage: 'Packages',
  },
  titlesPatchSystems: {
    id: 'titlesPatchSystems',
    description: 'title for Systems page',
    defaultMessage: 'Systems',
  },
  titlesSystems: {
    id: 'titlesSystems',
    description: 'title with capital letters',
    defaultMessage: 'Systems',
  },
});
