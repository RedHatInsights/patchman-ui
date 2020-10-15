import { sortable } from '@patternfly/react-table/dist/js';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { createAdvisoriesIcons, createUpgradableColumn, remediationProvider } from '../../Utilities/Helpers';
import './SystemsListAssets.scss';

export const systemsListColumns = [
    {
        key: 'display_name',
        title: 'Name',
        composed: ['facts.os_release', 'display_name'],
        transforms: [sortable],
        props: {
            width: 50
        }
    },
    {
        key: 'packages_installed',
        title: 'Packages',
        transforms: [sortable],
        props: {
            width: 10
        }
    },
    {
        key: 'applicable_advisories',
        title: 'Applicable advisories',
        transforms: [sortable],
        props: {
            width: 20
        },
        renderFunc: value => createAdvisoriesIcons(value)
    }
];

export const packageSystemsColumns = [
    {
        key: 'display_name',
        title: 'Name',
        composed: ['facts.os_release', 'display_name'],
        transforms: [sortable],
        props: {
            width: 50
        }
    },
    {
        key: 'installed_version',
        title: 'Installed version',
        transforms: [sortable],
        props: {
            width: 10
        }
    },
    {
        key: 'latest_version',
        title: 'Latest version',
        transforms: [sortable],
        props: {
            width: 10
        }
    },
    {
        key: 'upgradable',
        title: 'Status',
        props: {
            width: 20
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
                            rowData.id
                        )
                    )
                );
            }
        }
    ];
};
