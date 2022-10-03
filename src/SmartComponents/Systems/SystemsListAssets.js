import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import { createAdvisoriesIcons, createUpgradableColumn,
    remediationProvider, createOSColumn, createPackagesColumn } from '../../Utilities/Helpers';
import './SystemsListAssets.scss';

export const systemsListColumns = (isPatchSetEnabled = false) => [
    ...(isPatchSetEnabled ? [{
        key: 'baseline_name',
        title: 'Patch template',
        props: {
            width: 5
        }
    }] : []),
    {
        key: 'operating_system',
        title: 'OS',
        renderFunc: value => createOSColumn(value),
        props: {
            width: 5
        }
    },
    {
        key: 'packages_installed',
        title: 'Packages',
        renderFunc: (packageCount, systemID) => createPackagesColumn(packageCount, systemID),
        props: {
            width: 10
        }
    },
    {
        key: 'applicable_advisories',
        title: 'Applicable advisories',
        props: {
            width: 15
        },
        renderFunc: value => createAdvisoriesIcons(value)
    }
];

export const packageSystemsColumns = [
    {
        key: 'display_name',
        title: 'Name',
        composed: ['facts.os_release', 'display_name'],
        props: {
            width: 40
        }
    },
    {
        key: 'tags',
        title: 'Tags',
        props: { width: 10, isStatic: true }
    },
    {
        key: 'installed_evra',
        title: 'Installed version',
        props: {
            width: 15
        }
    },
    {
        key: 'available_evra',
        title: 'Latest version',
        props: {
            width: 15
        }
    },
    {
        key: 'upgradable',
        title: 'Status',
        props: {
            width: 20,
            isStatic: true
        },
        renderFunc: value => createUpgradableColumn(value)
    }
];

const isRemediationDisabled = (row) => {
    const { applicable_advisories: applicableAdvisories } = row || {};
    return applicableAdvisories && applicableAdvisories.every(typeSum => typeSum === 0);
};

const isPatchSetRemovalDisabled = (row) => {
    const { baseline_name: baselineName } = row || {};
    return !baselineName || (typeof baselineName === 'string' && baselineName === '');
};

export const systemsRowActions = (showRemediationModal, showPatchSetModal, isPatchSetEnabled, openUnassignSystemsModal, row) => {
    return [
        {
            title: 'Apply all applicable advisories',
            isDisabled: isRemediationDisabled(row),
            onClick: (event, rowId, rowData) => {
                fetchApplicableSystemAdvisoriesApi({
                    id: rowData.id,
                    limit: 10000
                }).then(res =>
                    showRemediationModal(
                        remediationProvider(
                            res.data.map(item => item.id),
                            rowData.id,
                            remediationIdentifiers.advisory
                        )
                    )
                );
            }
        },
        ...(isPatchSetEnabled && showPatchSetModal ? [{
            title: 'Assign to a template',
            onClick: (event, rowId, rowData) => {
                showPatchSetModal(rowData?.id);
            }
        },
        {
            title: 'Remove from a template',
            isDisabled: isPatchSetRemovalDisabled(row),
            onClick: (event, rowId, rowData) => {
                openUnassignSystemsModal([rowData.id]);
            }
        }
        ] : [])
    ];
};
