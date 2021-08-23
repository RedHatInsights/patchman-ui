import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import { createAdvisoriesIcons, createUpgradableColumn,
    remediationProvider, createOSColumn } from '../../Utilities/Helpers';
import './SystemsListAssets.scss';

export const systemsListColumns = [
    {
        key: 'display_name',
        title: 'Name',
        composed: ['facts.os_release', 'display_name'],
        props: {
            width: 50
        }
    },
    {
        key: 'operating_system',
        title: 'OS',
        renderFunc: value => createOSColumn(value),
        props: {
            width: 10
        }
    },
    {
        key: 'packages_installed',
        title: 'Packages',
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
            width: 50
        }
    },
    {
        key: 'installed_evra',
        title: 'Installed version',
        props: {
            width: 10
        }
    },
    {
        key: 'available_evra',
        title: 'Latest version',
        props: {
            width: 10
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

export const systemsRowActions = showRemediationModal => {
    return [
        {
            title: 'Apply all applicable advisories',
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
        }
    ];
};
