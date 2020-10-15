import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import { flatMap } from 'lodash';
import React from 'react';
import AdvisoryType from '../PresentationalComponents/AdvisoryType/AdvisoryType';
import { EmptyAdvisoryList, EmptyPackagesList } from '../PresentationalComponents/Snippets/EmptyStates';
import ExternalLink from '../PresentationalComponents/Snippets/ExternalLink';
import Label from '../PresentationalComponents/Snippets/Label';
import { entityTypes } from './constants';
import { createUpgradableColumn, handlePatchLink, truncate } from './Helpers';

export const createAdvisoriesRows = (rows, expandedRows, selectedRows) => {
    if (rows.length !== 0) {
        return flatMap(rows, (row, index) => {
            return [
                {
                    id: row.id,
                    isOpen: expandedRows[row.id] === true,
                    selected: selectedRows[row.id] !== undefined,
                    cells: [
                        { title: handlePatchLink(entityTypes.advisories, row.id) },
                        { title: processDate(row.attributes.public_date) },
                        {
                            title: (
                                <AdvisoryType
                                    type={row.attributes.advisory_type}
                                />
                            )
                        },
                        {
                            title: handlePatchLink(
                                entityTypes.advisories,
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
                                    <Text component={TextVariants.p} style={{ whiteSpace: 'pre-line' }}>
                                        {truncate(row.attributes.description.replace(
                                            new RegExp('\\n(?=[^\\n])', 'g'),
                                            ''
                                        ), 570, handlePatchLink(entityTypes.advisories, row.id, 'Read more'))}
                                    </Text>
                                    <ExternalLink link={`https://access.redhat.com/errata/${row.id}`}
                                        text={'View packages and errata at access.redhat.com'} />
                                </TextContent>
                            )
                        }
                    ],
                    parent: index * 2
                }
            ];
        });
    } else {
        return [
            {
                heightAuto: true,
                cells: [
                    {
                        props: { colSpan: 5 },
                        title: <EmptyAdvisoryList />
                    }
                ]
            }
        ];
    }
};

export const createSystemAdvisoriesRows = (
    rows,
    expandedRows,
    selectedRows
) => {
    if (rows.length !== 0) {
        return flatMap(rows, (row, index) => {
            return [
                {
                    id: row.id,
                    isOpen: expandedRows[row.id] === true,
                    selected: selectedRows[row.id] !== undefined,
                    cells: [
                        { title: handlePatchLink(entityTypes.advisories, row.id) },
                        { title: processDate(row.attributes.public_date) },
                        {
                            title: (
                                <AdvisoryType
                                    type={row.attributes.advisory_type}
                                />
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
                                    <Text component={TextVariants.p} style={{ whiteSpace: 'pre-line' }}>
                                        {truncate(row.attributes.description.replace(
                                            new RegExp('\\n(?=[^\\n])', 'g'),
                                            ''
                                        ), 570, handlePatchLink(entityTypes.advisories, row.id, 'Read more'))}
                                    </Text>
                                    <ExternalLink link={`https://access.redhat.com/errata/${row.id}`}
                                        text={'View packages and errata at access.redhat.com'} />
                                </TextContent>
                            )
                        }
                    ],
                    parent: index * 2
                }
            ];
        });
    } else {
        return [
            {
                heightAuto: true,
                cells: [
                    {
                        props: { colSpan: 6 },
                        title: <EmptyAdvisoryList />
                    }
                ]
            }
        ];
    }
};

export const createSystemsRows = (rows, selectedRows = {}) => {
    const data =
        rows &&
        rows.map(row => {
            return {
                id: row.id,
                key: Math.random().toString() + row.id,
                packages_installed: row.attributes.packages_installed,
                applicable_advisories: [
                    row.attributes.rhea_count || 0,
                    row.attributes.rhba_count || 0,
                    row.attributes.rhsa_count || 0
                ],
                selected: selectedRows[row.id] !== undefined
            };
        });
    return data || [];
};

export const createPackageSystemsRows = (rows, selectedRows = {}) => {
    const data =
        rows &&
        rows.map(row => {
            return {
                id: row.id,
                key: Math.random().toString() + row.id,
                installed_version: row.installed_evra,
                latest_version: row.available_evra,
                upgradable: row.updatable,
                selected: selectedRows[row.id] !== undefined
            };
        });
    return data || [];
};

export const createSystemPackagesRows = (rows, selectedRows = {}) => {
    if (rows.length !== 0) {
        return rows.map(pkg => {
            const pkgUpdates = pkg.updates || [];
            const latestUpdate = pkgUpdates[pkgUpdates.length - 1];

            return {
                id: pkg.name,
                key: pkg.name,
                selected: selectedRows[pkg.name] !== undefined,
                disableCheckbox: !latestUpdate,
                cells: [
                    { title: handlePatchLink(entityTypes.packages, pkg.name) },
                    { title: pkg.evra },
                    { title: (latestUpdate && latestUpdate.evra) || pkg.evra },
                    { title: createUpgradableColumn(pkg.updatable) },
                    { title: pkg.summary }
                ]
            };
        });
    } else {
        return [
            {
                heightAuto: true,
                cells: [
                    {
                        props: { colSpan: 7 },
                        title: <EmptyPackagesList />
                    }
                ]
            }
        ];
    }
};

export const createPackagesRows = (rows) => {
    if (rows.length !== 0) {
        return rows.map(pkg => {
            return {
                id: pkg.name,
                key: pkg.name,
                cells: [
                    { title: handlePatchLink(entityTypes.packages, pkg.name) },
                    { title: pkg.systems_installed },
                    { title: pkg.systems_updatable },
                    { title: pkg.summary }
                ]
            };
        });
    } else {
        return [
            {
                heightAuto: true,
                cells: [
                    {
                        props: { colSpan: 7 },
                        title: <EmptyPackagesList />
                    }
                ]
            }
        ];
    }
};