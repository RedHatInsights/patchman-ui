import { classNames } from '@patternfly/react-table';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import {
    createAdvisoriesIcons,
    remediationProvider
} from '../../Utilities/Helpers';
import './SystemsListAssets.scss';

export const systemsListColumns = [
    {
        key: 'display_name',
        title: 'Name',
        composed: ['facts.os_release', 'display_name'],
        transforms: [classNames('col-width-40')]
    },
    {
        key: 'applicable_advisories',
        title: 'Applicable advisories',
        transforms: [classNames('col-width-30')],
        renderFunc: value => createAdvisoriesIcons(value)
    },
    {
        key: 'updated',
        title: 'Last seen',
        transforms: [classNames('col-width-30')],
        renderFunc: value => (
            <React.Fragment>
                <DateFormat date={value} />
            </React.Fragment>
        )
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
