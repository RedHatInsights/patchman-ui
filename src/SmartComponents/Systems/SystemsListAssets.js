import { classNames, sortable } from '@patternfly/react-table';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { createAdvisoriesIcons, remediationProvider } from '../../Utilities/Helpers';
import './SystemsListAssets.scss';

export const systemsListColumns = [
    {
        key: 'display_name',
        title: 'Name',
        composed: ['facts.os_release', 'display_name'],
        transforms: [classNames('col-width-40'), sortable]
    },
    {
        key: 'applicable_advisories',
        title: 'Applicable advisories',
        transforms: [classNames('col-width-30')],
        renderFunc: value => createAdvisoriesIcons(value)
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
