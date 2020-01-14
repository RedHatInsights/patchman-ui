/* eslint-disable no-console */
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import { flatMap } from 'lodash';
import React from 'react';
import AdvisoryType from '../PresentationalComponents/AdvisoryType/AdvisoryType';
import Label from '../PresentationalComponents/Snippets/Label';
import PortalAdvisoryLink from '../PresentationalComponents/Snippets/PortalAdvisoryLink';
import { handleAdvisoryLink } from './Helpers';

export const createAdvisoriesRows = (rows, expandedRows, selectedRows) => {
    return flatMap(rows, (row, index) => {
        return [
            {
                id: row.id,
                isOpen: expandedRows[row.id] === true,
                selected: selectedRows[row.id] === true,
                cells: [
                    { title: handleAdvisoryLink(row.id) },
                    { title: processDate(row.attributes.public_date) },
                    {
                        title: (
                            <AdvisoryType type={row.attributes.advisory_type} />
                        )
                    },
                    {
                        title: handleAdvisoryLink(
                            row.id,
                            row.attributes.applicable_systems
                        )
                    },
                    row.attributes.synopsis
                ]
            },
            {
                cells: [
                    {
                        title: (
                            <TextContent>
                                <Label>Description</Label>
                                <Text component={TextVariants.p}>
                                    {row.attributes.description}
                                </Text>
                                <PortalAdvisoryLink advisory={row.id} />
                            </TextContent>
                        )
                    }
                ],
                parent: index * 2
            }
        ];
    });
};

export const createSystemAdvisoriesRows = (
    rows,
    expandedRows,
    selectedRows
) => {
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
                    row.attributes.synopsis
                ]
            },
            {
                cells: [
                    {
                        title: (
                            <TextContent>
                                <Label>Description</Label>
                                <Text component={TextVariants.p}>
                                    {row.attributes.description}
                                </Text>
                            </TextContent>
                        )
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
                row.attributes.rhea_count || 0,
                row.attributes.rhba_count || 0,
                row.attributes.rhsa_count || 0
            ]
        };
    });
    return data;
};
