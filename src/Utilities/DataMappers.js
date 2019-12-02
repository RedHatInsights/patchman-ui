/* eslint-disable no-console */
import { flatMap } from 'lodash';

export const createAdvisoriesRows = (rows, expandedRows) => {
    return flatMap(rows, (row, index) => {
        return [
            {
                id: row.id,
                isOpen: expandedRows[row.id] === true,
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
