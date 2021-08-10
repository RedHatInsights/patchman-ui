
/* eslint-disable max-len */
/* eslint sort-keys: ["error", "asc", {minKeys: 4}] */

import { defineMessages } from 'react-intl';

export default defineMessages({

    generalAppName: {
        id: 'generalAppName',
        description: 'regsiter page title',
        defaultMessage: 'Patch'
    },
    labelsBulkSelectAll: {
        id: 'labelsBulkSelectAll',
        description: 'bulk select option',
        defaultMessage: 'Select all ({count})'
    },
    labelsBulkSelectNone: {
        id: 'labelsBulkSelectNone',
        description: 'bulk select option',
        defaultMessage: 'Select none (0)'
    },
    labelsBulkSelectPage: {
        id: 'labelsBulkSelectPage',
        description: 'bulk select option',
        defaultMessage: 'Select page ({count})'
    },
    labelsColumnsApplicableSystems: {
        id: 'labelsColumnsApplicableSystems',
        description: 'shared label',
        defaultMessage: 'Applicable systems'
    },
    labelsColumnsCVSS: {
        id: 'labelsColumnsCVSS',
        description: 'shared label',
        defaultMessage: 'CVSS'
    },
    labelsColumnsCveID: {
        id: 'labelsColumnsCveID',
        description: 'shared label',
        defaultMessage: 'CVE ID'
    },
    labelsColumnsInstalledVersion: {
        id: 'labelsColumnsInstalledVersion',
        description: 'shared label',
        defaultMessage: 'Installed version'
    },
    labelsColumnsLatestVersion: {
        id: 'labelsColumnsLatestVersion',
        description: 'shared label',
        defaultMessage: 'Latest version'
    },
    labelsColumnsName: {
        id: 'labelsColumnsName',
        description: 'shared label',
        defaultMessage: 'Name'
    },
    labelsColumnsPublishDate: {
        id: 'labelsColumnsPublishDate',
        description: 'shared label',
        defaultMessage: 'Publish date'
    },
    labelsColumnsSeverity: {
        id: 'labelsColumnsSeverity',
        description: 'shared label',
        defaultMessage: 'Severity'
    },
    labelsColumnsStatus: {
        id: 'labelsColumnsStatus',
        description: 'Label for status fitler',
        defaultMessage: 'Status'
    },
    labelsColumnsStatusPlaceholder: {
        id: 'labelsColumnsStatus',
        description: 'Label for status fitler placeholder',
        defaultMessage: 'Filter by status'
    },
    labelsColumnsSummary: {
        id: 'labelsColumnsSummary',
        description: 'shared label',
        defaultMessage: 'Summary'
    },
    labelsColumnsSynopsis: {
        id: 'labelsColumnsSynopsis',
        description: 'shared label',
        defaultMessage: 'Synopsis'
    },
    labelsColumnsType: {
        id: 'labelsColumnsType',
        description: 'Label for type fitler placeholder',
        defaultMessage: 'Type'
    },
    labelsColumnsUpgradable: {
        id: 'labelsColumnsUpgradable',
        description: 'shared label',
        defaultMessage: 'Upgradable'
    },
    labelsCves: {
        id: 'labelsCves',
        description: 'label for cves info link',
        defaultMessage: 'CVEs'
    },
    labelsCvesButton: {
        id: 'labelsCvesButton',
        description: 'label for cves button',
        defaultMessage: '{cvesCount, plural, one {# CVE} other {# CVEs}} associated with this patch'
    },
    labelsDescription: {
        id: 'labelsDescription',
        description: 'Label',
        defaultMessage: 'Description'
    },
    labelsFiltersClear: {
        id: 'labelsFiltersClear',
        description: 'label for remove filter chips',
        defaultMessage: 'Clear filters'
    },
    labelsFiltersCvesSearchPlaceHolder: {
        id: 'labelsFiltersCvesSearch',
        description: 'search filter placeholder for packages pages',
        defaultMessage: 'Filter by CVE ID'
    },
    labelsFiltersPackagesSearchPlaceHolder: {
        id: 'labelsFiltersPackagesSearchPlaceHolder',
        description: 'search filter placeholder for packages pages',
        defaultMessage: 'Filter by name or summary'
    },
    labelsFiltersPackagesSearchTitle: {
        id: 'labelsFiltersPackagesSearchTitle',
        description: 'search filter placeholder for packages pages',
        defaultMessage: 'Package'
    },
    labelsFiltersPublishDate: {
        id: 'labelsFiltersPublishDate',
        description: 'shared label',
        defaultMessage: 'Publish date'
    },
    labelsFiltersPublishDatePlaceholder: {
        id: 'labelsFiltersPublishDate',
        description: 'shared placeholder label',
        defaultMessage: 'Filter by publish date'
    },
    labelsFiltersReset: {
        id: 'labelsFiltersReset',
        description: 'label for remove filter chips',
        defaultMessage: 'Reset filters'
    },
    labelsFiltersSearch: {
        id: 'labelsFiltersSearch',
        description: 'Label for search fitler placeholder',
        defaultMessage: 'Search '
    },
    labelsFiltersSearchAdvisoriesPlaceholder: {
        id: 'labelsFiltersSearchAdvisoriesPlaceholder',
        description: 'Label for search fitler placeholder',
        defaultMessage: 'Filter by name or synopsis'
    },
    labelsFiltersSearchAdvisoriesTitle: {
        id: 'labelsFiltersSearchAdvisoriesTitle',
        description: 'Label for search fitler placeholder',
        defaultMessage: 'Advisory'
    },
    labelsFiltersStatus: {
        id: 'labelsFiltersStatus',
        description: 'Label for status fitler placeholder',
        defaultMessage: 'Status'
    },
    labelsFiltersSystemsSearchPlaceholder: {
        id: 'labelsFiltersSystemsSearch',
        description: 'search filter placeholder for systems pages',
        defaultMessage: 'Filter by name'
    },
    labelsFiltersSystemsSearchTitle: {
        id: 'labelsFiltersSystemsSearchTitle',
        description: 'search filter placeholder for systems pages',
        defaultMessage: 'System'
    },
    labelsFiltersType: {
        id: 'labelsFiltersType',
        description: 'Label for type fitler',
        defaultMessage: 'Type'
    },
    labelsFiltersTypePlaceholder: {
        id: 'labelsFiltersType',
        description: 'Label for type fitler placeholder',
        defaultMessage: 'Filter by type'
    },
    labelsModifiedDate: {
        id: 'labelsModifiedDate',
        description: 'Modified date label',
        defaultMessage: 'Modified {date}'
    },
    labelsNotAuthorizedDescription: {
        id: 'notAuthorizedDescription',
        description: 'Description for component which shows up when user doesn\'t have permission to view content',
        defaultMessage: 'Contact your organization administrator(s) for more information.'
    },
    labelsNotAuthorizedTitle: {
        id: 'notAuthorizedTitle',
        description: 'Title for component which shows up when user doesn\'t have permission to view content',
        defaultMessage: 'You do not have permissions to view or manage Patch'
    },
    labelsPublicDate: {
        id: 'labelsPublicDate',
        description: 'Public date label',
        defaultMessage: 'Issued {date}'
    },
    labelsRemediate: {
        id: 'labelsRemediate',
        description: 'Button label',
        defaultMessage: 'Remediate'
    },
    labelsReturnToLandingPage: {
        id: 'returnToLandingPage',
        description: 'Return to landing page label for general usage',
        defaultMessage: 'Go to landing page'
    },
    labelsReturnToPreviousPage: {
        id: 'returnPreviousPage',
        description: 'Return to previous page label for general usage',
        defaultMessage: 'Return to previous page'
    },
    labelsSeverity: {
        id: 'labelsSeverity',
        description: 'label for cves info',
        defaultMessage: 'Severity'
    },
    linksLearnAboutInsights: {
        id: 'linksLearnAboutInsights',
        description: 'no system data page button label',
        defaultMessage: 'Learn about the Insights client'
    },
    linksLearnMore: {
        id: 'linksLearnMore',
        description: 'Learn more',
        defaultMessage: 'Learn more'
    },
    linksReadMore: {
        id: 'linksReadMore',
        description: 'Label',
        defaultMessage: 'Read more'
    },
    linksSearchSecurityRatings: {
        id: 'linksSearchSecurityRatings',
        description: 'A link label to security ratings page',
        defaultMessage: 'Learn more about security ratings'
    },
    linksViewPackagesAndErrata: {
        id: 'viewPackagesAndErrata',
        description: 'A link label to access.redhat.com ',
        defaultMessage: 'View packages and errata at access.redhat.com'
    },
    statesActivateInsights: {
        id: 'statesActivateInsights',
        description: 'no system data page body',
        defaultMessage: 'Activate the Insights client'
    },
    statesError: {
        id: 'statesError',
        description: 'Label',
        defaultMessage: 'Error'
    },
    statesMinimumPatchPermissionsRequired: {
        id: 'statesMinimumPatchPermissionsRequired',
        description: 'No access page body',
        defaultMessage: 'To view the content of this page, you must be granted a minimum of Patch permissions from your Organisation Administratior'
    },
    statesNoApplicableAdvisories: {
        id: 'statesNoApplicableAdvisories',
        description: 'system up to date page title',
        defaultMessage: 'No applicable advisories'
    },
    statesNoMatchingAdvisories: {
        id: 'statesNoMatchingAdvisories',
        description: 'Label',
        defaultMessage: 'No matching advisories found'
    },
    statesNoMatchingCve: {
        id: 'statesNoMatchingCve',
        description: 'Label',
        defaultMessage: 'No matching CVES found'
    },
    statesNoMatchingPackages: {
        id: 'statesNoMatchingPackages',
        description: 'Label',
        defaultMessage: 'No matching packages found'
    },
    statesPatchNotConfigured: {
        id: 'statesPatchNotConfigured',
        description: 'no system data page title',
        defaultMessage: 'Patch is not yet configured'
    },
    statesRequiresPatchPermissions: {
        id: 'statesRequiresPatchPermissions',
        description: 'No access page title',
        defaultMessage: 'This application requires Patch permissions'
    },
    statesSystemUpToDate: {
        id: 'statesSystemUpToDate',
        description: 'system up to date page body',
        defaultMessage: 'This system is up to date, based on package information submitted at the most recent system check-in'
    },
    textEmptyStateBody: {
        id: 'textEmptyStateBody',
        description: 'text for the Empty state body',
        defaultMessage: 'To continue, edit your filter settings and search again.'
    },
    textLockVersionTooltip: {
        id: 'textLockVersionTooltip',
        description: 'Tooltip text for vesrion lock column',
        defaultMessage: `Your RHEL version is locked at version {lockedVersion}`
    },
    textThirdPartyInfo: {
        id: 'textThirdPartyInfo',
        description: 'text about the third paty managed hosts',
        defaultMessage: 'This system has content that is managed by repositories other than the Red Hat CDN'
    },
    titlesAdvisories: {
        id: 'titlesAdvisories',
        description: 'page title with capital letter',
        defaultMessage: 'Advisories'
    },
    titlesAffectedSystems: {
        id: 'affectedSystems',
        description: 'page title with capital letter',
        defaultMessage: 'Affected systems'
    },
    titlesPackages: {
        id: 'titlesPackages',
        description: 'page title with capital letters',
        defaultMessage: 'Packages'
    },
    titlesPatchAdvisories: {
        id: 'titlesPatchAdvisories',
        description: 'title for Advisories page',
        defaultMessage: 'Patch advisories'
    },
    titlesPatchPackages: {
        id: 'titlesPatchPackages',
        description: 'title for Packages page',
        defaultMessage: 'Patch packages'
    },
    titlesPatchSystems: {
        id: 'titlesPatchSystems',
        description: 'title for Systems page',
        defaultMessage: 'Patch systems'
    },
    titlesSystems: {
        id: 'titlesSystems',
        description: 'title with capital letters',
        defaultMessage: 'Systems'
    }
});
