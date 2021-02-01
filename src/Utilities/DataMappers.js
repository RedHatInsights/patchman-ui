import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import { flatMap } from 'lodash';
import React from 'react';
import AdvisoryType from '../PresentationalComponents/AdvisoryType/AdvisoryType';
import { DescriptionWithLink } from '../PresentationalComponents/Snippets/DescriptionWithLink';
import { EmptyAdvisoryList, EmptyPackagesList } from '../PresentationalComponents/Snippets/EmptyStates';
import { SystemUpToDate } from '../PresentationalComponents/Snippets/SystemUpToDate';
import { entityTypes } from './constants';
import { createUpgradableColumn, handlePatchLink } from './Helpers';

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
                        row.attributes.synopsis,
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
                        { title: processDate(row.attributes.public_date) }
                    ]
                },
                {
                    cells: [
                        {
                            title: <DescriptionWithLink row = {row} />
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
    selectedRows,
    metadata
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
                        row.attributes.synopsis,
                        {
                            title: (
                                <AdvisoryType
                                    type={row.attributes.advisory_type}
                                />
                            )
                        },
                        { title: processDate(row.attributes.public_date) }
                    ]
                },
                {
                    cells: [
                        {
                            title: <DescriptionWithLink row = {row} />
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
                        title: !metadata.search && (metadata.filter &&  Object.keys(metadata.filter).length === 0)
                            && <SystemUpToDate />
                            || <EmptyAdvisoryList />
                    }
                ]
            }
        ];
    }
};

export const createSystemsRows = (rows, selectedRows = {}) => {
    const data =
        rows &&
        rows.map(({ id, attributes }) => {
            return {
                id,
                key: Math.random().toString() + id,
                packages_installed: attributes.packages_installed,
                applicable_advisories: [
                    attributes.rhea_count || 0,
                    attributes.rhba_count || 0,
                    attributes.rhsa_count || 0
                ],
                operating_system:
                    attributes.os_name && `${attributes.os_name} ${attributes.os_major}.${attributes.os_minor}`
                        || 'No data',
                selected: selectedRows[id] !== undefined
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
                installed_evra: row.installed_evra,
                available_evra: row.updatable && row.available_evra || row.installed_evra,
                upgradable: row.updatable,
                selected: selectedRows[row.id] !== undefined
            };
        });
    return data || [];
};

export const createSystemPackagesRows = (rows, selectedRows = {}) => {
    if (rows.length !== 0) {
        return rows.map(pkg => {
            const pkgNEVRA = `${pkg.name}-${pkg.evra}`;
            const pkgUpdates = pkg.updates || [];
            const latestUpdate = pkgUpdates[pkgUpdates.length - 1];

            return {
                id: pkgNEVRA,
                key: pkgNEVRA,
                selected: selectedRows[pkgNEVRA] !== undefined,
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
