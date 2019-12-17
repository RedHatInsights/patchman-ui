/* eslint-disable no-console */
import { flatMap } from 'lodash';

export const createAdvisoriesRows = (rows, expandedRows, selectedRows) => {
    return flatMap(rows, (row, index) => {
        return [
            {
                id: row.id,
                isOpen: expandedRows[row.id] === true,
                selected: selectedRows[row.id] === true,
                cells: [
                    row.id,
                    row.attributes.public_date,
                    row.attributes.advisory_type,
                    row.attributes.applicable_systems,
                    row.attributes.synopsis
                ]
            },
            {
                cells: [
                    {
                        title: 'asd'
                    }
                ],
                parent: index * 2
            }
        ];
    });
};

export const createSystemsRows = rows => {
    const data = rows.map(row => {
        return {
            id: row.id,
            key: row.id,
            applicable_advisories: [
                row.attributes.rhea_count || 2,
                row.attributes.rhba_count,
                row.attributes.rhsa_count
            ]
        };
    });
    return data;
};
