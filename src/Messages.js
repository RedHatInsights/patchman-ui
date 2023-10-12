
/* eslint-disable max-len */
/* eslint sort-keys: ["error", "asc", {minKeys: 4}] */

import { defineMessages } from 'react-intl';

export default defineMessages({

    generalAppName: {
        id: 'generalAppName',
        description: 'regsiter page title',
        defaultMessage: 'Patch'
    },
    labelsActions: {
        id: 'labelsActions',
        description: 'dropdown with actions label',
        defaultMessage: 'Actions'
    },
    labelsAffectedSystemsCount: {
        id: 'labelsAffectedSystemsCount',
        description: 'applicable systems number label',
        defaultMessage: '{systemsCount} affected systems'
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
    labelsButtonCreateTemplate: {
        id: 'labelsButtonCreateTemplate',
        description: 'button label',
        defaultMessage: 'Create a template'
    },
    labelsButtonEditTemplate: {
        id: 'labelsButtonEditTemplate',
        description: 'button label',
        defaultMessage: 'Edit template'
    },
    labelsButtonRemoveTemplate: {
        id: 'labelsButtonRemoveTemplate',
        description: 'button label',
        defaultMessage: 'Delete template'
    },
    labelsCancel: {
        id: 'labelsCancel',
        description: 'Button label',
        defaultMessage: 'Cancel'
    },
    labelsColumnsAffectedSystems: {
        id: 'labelsColumnsAffectedSystems',
        description: 'shared label',
        defaultMessage: 'Affected systems'
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
    labelsColumnsInstallableSystems: {
        id: 'labelsColumnsApplicableSystems',
        description: 'shared label',
        defaultMessage: 'Installable systems'
    },
    labelsColumnsInstalledSystems: {
        id: 'labelsColumnsApplicableSystems',
        description: 'shared label',
        defaultMessage: 'Installed systems'
    },
    labelsColumnsInstalledVersion: {
        id: 'labelsColumnsInstalledVersion',
        description: 'shared label',
        defaultMessage: 'Installed version'
    },
    labelsColumnsLatestApplicableVersion: {
        id: 'labelsColumnsLatestApplicableVersion',
        description: 'shared label',
        defaultMessage: 'Latest applicable version'
    },
    labelsColumnsLatestInstallableVersion: {
        id: 'labelsColumnsLatestInstallableVersion',
        description: 'shared label',
        defaultMessage: 'Installable version'
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
    labelsColumnsReboot: {
        id: 'labelsColumnsRebootRequired',
        description: 'shared label',
        defaultMessage: 'Reboot'
    },
    labelsColumnsSeverity: {
        id: 'labelsColumnsSeverity',
        description: 'shared label',
        defaultMessage: 'Severity'
    },
    labelsColumnsStatus: {
        id: 'labelsColumnsStatus',
        description: 'Label for status filter',
        defaultMessage: 'Status'
    },
    labelsColumnsStatusPlaceholder: {
        id: 'labelsColumnsStatus',
        description: 'Label for status filter placeholder',
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
    labelsColumnsTemplate: {
        id: 'labelsColumnsTemplate',
        description: 'Label for patch template column',
        defaultMessage: 'Template'
    },
    labelsColumnsType: {
        id: 'labelsColumnsType',
        description: 'Label for type filter placeholder',
        defaultMessage: 'Type'
    },
    labelsColumnsUpToApplicable: {
        id: 'labelsColumnsUpToApplicable',
        description: 'shared label',
        defaultMessage: 'Up to applicable version'
    },
    labelsColumnsUpToDate: {
        id: 'labelsColumnsUpToDate',
        description: 'shared label',
        defaultMessage: 'Red Hat advisories up to date'
    },
    labelsColumnsUpToInstallable: {
        id: 'labelsColumnsUpToInstallable',
        description: 'shared label',
        defaultMessage: 'Up to latest installable version'
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
    labelsDate: {
        id: 'labelsDate',
        description: 'Label',
        defaultMessage: 'Date'
    },
    labelsDelete: {
        id: 'labelsDelete',
        description: 'button label',
        defaultMessage: 'Delete'
    },
    labelsDescription: {
        id: 'labelsDescription',
        description: 'Label',
        defaultMessage: 'Description'
    },
    labelsDocumentation: {
        id: 'labelsDocumentation',
        description: 'Documentation link text',
        defaultMessage: 'Documentation'
    },
    labelsErrorDateLimit: {
        id: 'labelsErrorDateLimit',
        description: 'Label',
        defaultMessage: 'Date is before the allowable range.'
    },
    labelsErrorInvalidDate: {
        id: 'labelsErrorInvalidDate',
        description: 'Label',
        defaultMessage: 'The date should be valid of a type YYYY-MM-DD'
    },
    labelsFiltersClear: {
        id: 'labelsFiltersClear',
        description: 'label for remove filter chips',
        defaultMessage: 'Reset filters'
    },
    labelsFiltersCreator: {
        id: 'labelsFiltersCreator',
        description: 'Label for creator filter',
        defaultMessage: 'Creator'
    },
    labelsFiltersCreatorPlaceholder: {
        id: 'labelsFiltersCreatorPlaceholder',
        description: 'Label for creator filter',
        defaultMessage: 'Filter by creator'
    },
    labelsFiltersCvesSearchPlaceHolder: {
        id: 'labelsFiltersCvesSearch',
        description: 'search filter placeholder for packages pages',
        defaultMessage: 'Filter by CVE ID'
    },
    labelsFiltersOsVersion: {
        id: 'labelsFiltersOsVersion',
        description: 'filter for systems pages',
        defaultMessage: 'Operating system'
    },
    labelsFiltersOsVersionPlaceholder: {
        id: 'labelsFiltersOsVersionPlaceholder',
        description: 'filter for systems pages',
        defaultMessage: 'Filter by operating system'
    },
    labelsFiltersPackageVersionPlaceholder: {
        id: 'labelFiltersPackageVersionPlaceholder',
        description: 'Label for version filter placeholder',
        defaultMessage: 'Filter by version'
    },
    labelsFiltersPackageVersionTitle: {
        id: 'labelsFiltersPackageVersionTitle',
        description: 'Label for version filter title',
        defaultMessage: 'Version'
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
    labelsFiltersReboot: {
        id: 'labelsFiltersReboot',
        description: 'label for reboot filter chips',
        defaultMessage: 'Reboot'
    },
    labelsFiltersRebootPlaceholder: {
        id: 'labelsFiltersRebootPlaceholder',
        description: 'placeholder for reboot filter chips',
        defaultMessage: 'Filter by reboot'
    },
    labelsFiltersReset: {
        id: 'labelsFiltersReset',
        description: 'label for remove filter chips',
        defaultMessage: 'Reset filters'
    },
    labelsFiltersSearch: {
        id: 'labelsFiltersSearch',
        description: 'Label for search filter placeholder',
        defaultMessage: 'Search '
    },
    labelsFiltersSearchAdvisoriesPlaceholder: {
        id: 'labelsFiltersSearchAdvisoriesPlaceholder',
        description: 'Label for search filter placeholder',
        defaultMessage: 'Filter by name or synopsis'
    },
    labelsFiltersSearchAdvisoriesTitle: {
        id: 'labelsFiltersSearchAdvisoriesTitle',
        description: 'Label for search filter placeholder',
        defaultMessage: 'Advisory'
    },
    labelsFiltersSearchTemplatePlaceholder: {
        id: 'labelsFiltersSearchTemplatePlaceholder',
        description: 'Label for search filter placeholder',
        defaultMessage: 'Filter by template name '
    },
    labelsFiltersSearchTemplateTitle: {
        id: 'labelsFiltersSearchTemplateTitle',
        description: 'Label for search filter placeholder',
        defaultMessage: 'Template'
    },
    labelsFiltersStale: {
        id: 'labelsFiltersStale',
        description: 'Label for stale filter title',
        defaultMessage: 'Status'
    },
    labelsFiltersStalePlaceholder: {
        id: 'labelsFiltersStalePlaceholder',
        description: 'Label for stale filter placeholder',
        defaultMessage: 'Filter by status'
    },
    labelsFiltersStatus: {
        id: 'labelsFiltersStatus',
        description: 'Label for status filter placeholder',
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
        description: 'Label for type filter',
        defaultMessage: 'Type'
    },
    labelsFiltersTypePlaceholder: {
        id: 'labelsFiltersType',
        description: 'Label for type filter placeholder',
        defaultMessage: 'Filter by type'
    },
    labelsFiltersUpdatable: {
        id: 'labelsFiltersUpdatable',
        description: 'search filter placeholder for systems pages',
        defaultMessage: 'Patch status'
    },
    labelsFiltersUpdatablePlaceholder: {
        id: 'labelsFiltersUpdatablePlaceholder',
        description: 'search filter placeholder for systems updatable pages',
        defaultMessage: 'Filter by patch status'
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
    labelsRebootNotRequired: {
        id: 'labelsRequired',
        description: 'shared label',
        defaultMessage: 'Not required'
    },
    labelsRebootRequired: {
        id: 'labelsRequired',
        description: 'shared label',
        defaultMessage: 'Required'
    },
    labelsRemediate: {
        id: 'labelsRemediate',
        description: 'Button label',
        defaultMessage: 'Remediate'
    },
    labelsRemove: {
        id: 'labelsRemove',
        description: 'Button label',
        defaultMessage: 'Remove'
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
    labelsSelectedSystems: {
        id: 'labelsSelectedSystems',
        description: 'label',
        defaultMessage: 'Template applied to'
    },
    labelsSeverity: {
        id: 'labelsSeverity',
        description: 'label for cves info',
        defaultMessage: 'Severity'
    },
    labelsStatusStaleSystems: {
        id: 'labelsStatusStaleSystems',
        description: 'Label for status report',
        defaultMessage: 'Stale systems'
    },
    labelsStatusSystemsUpToDate: {
        id: 'labelsSystemsUpToDate',
        description: 'Label for status report',
        defaultMessage: 'Systems up to date'
    },
    labelsStatusSystemsWithPatchesAvailable: {
        id: 'labelsSystemsWithPatchesAvailable',
        description: 'Label for status report',
        defaultMessage: 'Systems with patches available'
    },
    labelsSystem: {
        id: 'labelsSystem',
        description: 'Generic pluralized systems label',
        defaultMessage: '{systemsCount, plural, one { # system } other { # systems }}'
    },
    labelsTemplateNoSystems: {
        id: 'labelsTemplateNoSystems',
        description: 'Template list table applied systems column fallback',
        defaultMessage: 'No systems applied'
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
    statesNoMatchingSystems: {
        id: 'statesNoMatchingSystems',
        description: 'Label',
        defaultMessage: 'No matching systems found'
    },
    statesNoMatchingTemplate: {
        id: 'statesNoMatchingTemplate',
        description: 'Label',
        defaultMessage: 'No matching patch template found'
    },
    statesNoTemplate: {
        id: 'statesNoTemplate',
        description: 'Label',
        defaultMessage: 'No templates yet'
    },
    statesNoTemplateBody: {
        id: 'statesNoTemplateBody',
        description: 'Label',
        defaultMessage: 'Control the scope of package and advisory updates to be installed on selected systems with templates. To get started, create a template.'
    },
    statesNoTemplateLink: {
        id: 'statesNoTemplateLink',
        description: 'Label',
        defaultMessage: 'Learn more about templates'
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
    templateAlertSystems: {
        id: 'templateAlertSystems',
        description: 'Template wizard alert',
        defaultMessage: 'A system can have only one content template, therefore if you apply a new content template to the system, it will be overwritten.'
    },
    templateApply: {
        id: 'templateApply',
        description: 'title with capital letters',
        defaultMessage: 'Apply template'
    },
    templateApplySystems: {
        id: 'templateApplySystems',
        description: 'step name of the patch template wizard',
        defaultMessage: 'Apply to systems (optional)'
    },
    templateContentStepExpandable: {
        id: 'templateContentStepExpandable',
        description: 'template wizard template expandable text',
        defaultMessage: 'You have a system with 10 applicable RHEL advisories, the most recent of which was published today. You apply a template with a date of yesterday to that system. After re-evaluation, the advisory published today will not be considered installable on the system, but will be considered applicable.'
    },
    templateContentStepExpandableTitle: {
        id: 'templateContentStepExpandableTitle',
        description: 'template wizard template expandable title',
        defaultMessage: 'What does it mean?'
    },
    templateContentStepSidebarName: {
        id: 'templateContentStepSidebarName',
        description: 'template wizard template left sidebar label',
        defaultMessage: 'Content'
    },
    templateContentStepText: {
        id: 'templateContentStepText',
        description: 'template wizard template text',
        defaultMessage: 'Templates provide you with consistent content across environments and time by allowing you to control the scope of package and advisory updates to be installed on selected systems.'
    },
    templateContentStepTitle: {
        id: 'templateContentStepTitle',
        description: 'template wizard template title',
        defaultMessage: 'Define template content'
    },
    templateCreate: {
        id: 'templateCreate',
        description: 'title with capital letters',
        defaultMessage: 'Create'
    },
    templateDateField: {
        id: 'templateDateField',
        description: 'Field name of the patch template wizard',
        defaultMessage: 'Select date of Red Hat repositiories'
    },
    templateDateUpto: {
        id: 'templateDateUpto',
        description: 'Field text of the patch template wizard',
        defaultMessage: 'Include advisories up to this date'
    },
    templateDescription: {
        id: 'templateDescription',
        description: 'description of the patch template wizard',
        defaultMessage: 'Prepare for your next patching cycle with a content template.'
    },
    templateDetailHeaderBreadcrumb: {
        id: 'templateDetailHeaderBreadcrumb',
        description: 'breadcrumb for template detail header',
        defaultMessage: 'Templates'
    },
    templateDetailStepSidebarName: {
        id: 'templateDetailStepSidebarName',
        description: 'template wizard template left sidebar label',
        defaultMessage: 'Details'
    },
    templateDetailStepText: {
        id: 'templateDetailStepText',
        description: 'template wizard template detail step text',
        defaultMessage: 'Enter a name and description for your template.'
    },
    templateDetailStepTitle: {
        id: 'templateDetailStepTitle',
        description: 'template wizard template detail step title',
        defaultMessage: 'Enter template details'
    },
    templateDetailTableCreatedBy: {
        id: 'templateDetailTableCreatedBy',
        description: 'label inside template detail header',
        defaultMessage: 'Created by:'
    },
    templateDetailTableDescription: {
        id: 'templateDetailTableDescription',
        description: 'label inside template detail header',
        defaultMessage: 'Template description:'
    },
    templateDetailTableLastEdited: {
        id: 'templateDetailTableLastEdited',
        description: 'title of template assigned systems table',
        defaultMessage: 'Last edited:'
    },
    templateDetailTablePublished: {
        id: 'templateDetailTablePublished',
        description: 'title of template assigned systems table',
        defaultMessage: 'Published:'
    },
    templateDetailTableTitle: {
        id: 'templateDetailTableTitle',
        description: 'title of template assigned systems table',
        defaultMessage: 'Systems applied'
    },
    templateDetailTableUpToDate: {
        id: 'templateDetailTableUpToDate',
        description: 'label inside template detail header',
        defaultMessage: 'Includes Red Hat repositories up to:'
    },
    templateEdit: {
        id: 'templateEdit',
        description: 'step name of the patch template wizard',
        defaultMessage: 'Edit content template '
    },
    templateError: {
        id: 'templateError',
        description: 'error text for the patch template wizard',
        defaultMessage: 'There was a problem processing the patch template. Please try again. If the problem persists, contact <a>Red Hat support</a>'
    },
    templateNew: {
        id: 'templateNew',
        description: 'step name of the patch template wizard',
        defaultMessage: 'New patch template '
    },
    templateNoAppliedSystemsButton: {
        id: 'templateNoAppliedSystemsButton',
        description: 'button in the empty state in template assigned systems table',
        defaultMessage: 'Apply to systems'
    },
    templateNoAppliedSystemsTitle: {
        id: 'templateNoAppliedSystemsTitle',
        description: 'title of the empty state in template assigned systems table',
        defaultMessage: 'Not applied to any systems'
    },
    templateNoSystemSelected: {
        id: 'templateNoSystemSelected',
        description: 'validation text of the patch template wizard',
        defaultMessage: 'At least one system must be selected. Actions must be associated to a system to be added to a playbook.'
    },
    templateOr: {
        id: 'templateOr',
        description: 'title with capital letters',
        defaultMessage: 'Or'
    },
    templatePopoverBody: {
        id: 'templatePopoverBody',
        description: 'Template page header popover body',
        defaultMessage: 'Templates allow you to control the scope of package and advisory updates to be installed on selected systems.'
    },
    templatePopoverHeader: {
        id: 'templatePopoverHeader',
        description: 'Template page header popover title',
        defaultMessage: 'About Templates'
    },
    templateReview: {
        id: 'templateReview',
        description: 'step name of the patch template wizard',
        defaultMessage: 'Review '
    },
    templateSelect: {
        id: 'templateSelect',
        description: 'title with capital letters',
        defaultMessage: 'Select a template to apply to the selected {systemCount, plural, one {# system} other {# systems}}.'
    },
    templateSelectExisting: {
        id: 'templateSelectExisting',
        description: 'title with capital letters',
        defaultMessage: 'Select an existing template'
    },
    templateStepSystems: {
        id: 'templateStepSystems',
        description: 'step name of the patch template wizard',
        defaultMessage: 'Systems (optional)'
    },
    templateTitle: {
        id: 'templateTitle',
        description: 'title of the patch template wizard',
        defaultMessage: 'Create content template '
    },
    templateTitleAssignSystem: {
        id: 'templateTitleAssignSystem',
        description: 'title of the patch template wizard',
        defaultMessage: 'Assign system(s) to a patch template '
    },
    templateWizardValidateLoading: {
        id: 'templateWizardValidateLoading',
        description: 'template wizard text when user input is not valid',
        defaultMessage: 'Template details are loading.'
    },
    templateWizardValidateNameTaken: {
        id: 'templateWizardValidateNameTaken',
        description: 'template wizard text when user input is not valid',
        defaultMessage: 'Template name already exists. Try a different name.'
    },
    templateWizardValidateRegex: {
        id: 'templateWizardValidateRegex',
        description: 'template wizard text when user input is not valid',
        defaultMessage: 'Must start with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, hyphens ( - ), and underscores ( _ ).'
    },
    textConfigurationInProgress: {
        id: 'textConfigurationInProgress',
        description: 'text for the patch template',
        defaultMessage: 'Configuration in progress'
    },
    textEmptyStateBody: {
        id: 'textEmptyStateBody',
        description: 'text for the Empty state body',
        defaultMessage: 'To continue, edit your filter settings and search again.'
    },
    textErrorSomethingWrong: {
        id: 'textErrorSomethingWrong',
        description: 'text for the error state body',
        defaultMessage: 'Something went wrong'
    },
    textLockVersionTooltip: {
        id: 'textLockVersionTooltip',
        description: 'Tooltip text for vesrion lock column',
        defaultMessage: `Your RHEL version is locked at version {lockedVersion}`
    },
    textNoVersionAvailable: {
        id: 'textNoVersionAvailable',
        description: 'text to notify there is not available version',
        defaultMessage: 'No version is available'
    },
    textPatchTemplateContent: {
        id: 'textPatchTemplateContent',
        description: 'text for the patch template',
        defaultMessage: 'Content'
    },
    textPatchTemplateDetails: {
        id: 'textPatchTemplateDetails',
        description: 'text for the patch template',
        defaultMessage: 'Details'
    },
    textPatchTemplatePending: {
        id: 'textPatchTemplatePending',
        description: 'text for the patch template',
        defaultMessage: 'Please allow a few minutes to set up a patch template. You will receive a notification when finished.'
    },
    textPatchTemplateReview: {
        id: 'textPatchTemplateReview',
        description: 'text for the patch template',
        defaultMessage: 'Review the details of your template.'
    },
    textPatchTemplateSuccessfuly: {
        id: 'textPatchTemplateSuccessfuly',
        description: 'text for the patch template',
        defaultMessage: 'Patch template configuration successful'
    },
    textPatchTemplateSystems: {
        id: 'textPatchTemplateSystems',
        description: 'text for the patch template',
        defaultMessage: 'Systems'
    },
    textRebootIsRequired: {
        id: 'textRebootIsRequired',
        description: 'Advisories table cell text',
        defaultMessage: 'Reboot is required'
    },
    textReturnToApp: {
        id: 'textReturnToApp',
        description: 'text for wizards',
        defaultMessage: 'Return to application'
    },
    textTemplateAddToExisting: {
        id: 'textTemplateAddToExisting',
        description: 'text for patch template wizard',
        defaultMessage: 'Add to existing patch template '
    },
    textTemplateChoose: {
        id: 'textTemplateChoose',
        description: 'text for patch template wizard',
        defaultMessage: 'Template'
    },
    textTemplateCreateNew: {
        id: 'textTemplateCreateNew',
        description: 'text for patch template wizard',
        defaultMessage: 'Create new patch template '
    },
    textTemplateSelectedSystems: {
        id: 'textTemplateSelectedSystems',
        description: 'text for patch template wizard',
        defaultMessage: 'You selected {systemsCount, plural, one {<b> # </b> system } other {<b> # </b> systems }}'
    },
    textUnassignSystemsShortTitle: {
        id: 'textUnassignSystemsShortTitle',
        description: 'text about systems being removed',
        defaultMessage: 'Remove system'
    },
    textUnassignSystemsStatement: {
        id: 'textUnassignSystemsStatement',
        description: 'text about systems being removed',
        defaultMessage: 'Do you want to remove the {systemsCount, plural, one {<b> # </b> selected system } other {<b> # </b> selected systems }} from assigned Patch templates?'
    },
    textUnassignSystemsTitle: {
        id: 'textUnassignSystemsTitle',
        description: 'text about systems being removed',
        defaultMessage: 'Remove systems from patch template '
    },
    textUnassignSystemsWarning: {
        id: 'textUnassignSystemsWarning',
        description: 'warning about systems without patch template assigned',
        defaultMessage: 'There {systemsCount, plural, one {is <b> # </b>  system } other { are <b> # </b>  systems }} you are trying to remove that {systemsCount, plural, one {is} other {are}} not assigned to any existing Patch template. This action will not affect {systemsCount, plural, one {it} other {them}}.'
    },
    titlesAdvisories: {
        id: 'titlesAdvisories',
        description: 'page title with capital letter',
        defaultMessage: 'Advisories'
    },
    titlesAdvisoryType: {
        id: 'titlesAdvisoryType',
        description: 'title with capital letter',
        defaultMessage: 'Advisory type'
    },
    titlesAffectedSystems: {
        id: 'affectedSystems',
        description: 'page title with capital letter',
        defaultMessage: 'Systems'
    },
    titlesMostImpactfulAdvisories: {
        id: 'titlesMostImpactfulAdvisories',
        description: 'page title with capital letter',
        defaultMessage: 'Most impactful advisories'
    },
    titlesPackages: {
        id: 'titlesPackages',
        description: 'page title with capital letters',
        defaultMessage: 'Packages'
    },
    titlesPatchAdvisories: {
        id: 'titlesPatchAdvisories',
        description: 'title for Advisories page',
        defaultMessage: 'Advisories'
    },
    titlesPatchPackages: {
        id: 'titlesPatchPackages',
        description: 'title for Packages page',
        defaultMessage: 'Packages'
    },
    titlesPatchSystems: {
        id: 'titlesPatchSystems',
        description: 'title for Systems page',
        defaultMessage: 'Systems'
    },
    titlesSystems: {
        id: 'titlesSystems',
        description: 'title with capital letters',
        defaultMessage: 'Systems'
    },
    titlesTemplate: {
        id: 'titlesTemplate',
        description: 'page title with capital letter',
        defaultMessage: 'Templates'
    },
    titlesTemplateAssign: {
        id: 'titlesTemplateAssign',
        description: 'title with capital letters',
        defaultMessage: 'Assign to a template'
    },
    titlesTemplateDeleteModalCheckbox: {
        id: 'titlesTemplateDeleteModalCheckbox',
        description: 'page title with capital letter',
        defaultMessage: 'I understand that this action cannot be undone.'
    },
    titlesTemplateDeleteModalText: {
        id: 'titlesTemplateDeleteModalText',
        description: 'page title with capital letter',
        defaultMessage: '<b>{templateName}</b> and all its data will be permanently deleted. Associated systems will be removed from the template but will not be deleted.'
    },
    titlesTemplateDeleteModalTitle: {
        id: 'titlesTemplateDeleteModalTitle',
        description: 'page title with capital letter',
        defaultMessage: 'Delete template?'
    },
    titlesTemplateNoDescription: {
        id: 'titlesTemplateNoDescription',
        description: 'title with capital letters',
        defaultMessage: 'No description available'
    },
    titlesTemplateNoDescriptionProvided: {
        id: 'titlesTemplateNoDescriptionProvided',
        description: 'title with capital letters',
        defaultMessage: 'No description provided'
    },
    titlesTemplateRemoveFromSystems: {
        id: 'titlesTemplateRemoveMultipleButton',
        description: 'title with capital letters',
        defaultMessage: 'Remove from {systemsCount, plural, one {system} other {systems}}'
    },
    titlesTemplateRemoveMultipleButton: {
        id: 'titlesTemplateRemoveMultipleButton',
        description: 'title with capital letters',
        defaultMessage: 'Remove from a template'
    }
});
