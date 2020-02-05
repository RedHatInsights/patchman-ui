import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import {
    createAdvisoriesIcons,
    remediationProvider
} from '../../Utilities/Helpers';

export const systemsListColumns = [
    {
        key: 'display_name',
        title: 'Name',
        composed: ['facts.os_release', 'display_name'],
        props: {
            width: 40
        }
    },
    {
        key: 'applicable_advisories',
        title: 'Applicable advisories',
        props: {
            width: 30
        },
        renderFunc: value => createAdvisoriesIcons(value)
    },
    {
        key: 'status',
        title: 'Status',
        props: {
            width: 30
        }
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
