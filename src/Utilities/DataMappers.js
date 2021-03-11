import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import { flatMap } from 'lodash';
import React from 'react';
import AdvisoryType from '../PresentationalComponents/AdvisoryType/AdvisoryType';
import { EmptyAdvisoryList, EmptyPackagesList, EmptyCvesList } from '../PresentationalComponents/Snippets/EmptyStates';
import { entityTypes, advisorySeverities } from './constants';
import { createUpgradableColumn, handlePatchLink } from './Helpers';
import { DescriptionWithLink } from '../PresentationalComponents/Snippets/DescriptionWithLink';
import { SystemUpToDate } from '../PresentationalComponents/Snippets/SystemUpToDate';
import { TextContent, TextListItem, TextListItemVariants } from '@patternfly/react-core';
import { SecurityIcon } from '@patternfly/react-icons';
import { Button } from '@patternfly/react-core';

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
                            title: <DescriptionWithLink row={row} />
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
                            title: <DescriptionWithLink row={row} />
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
                        title: !metadata.search && (metadata.filter && Object.keys(metadata.filter).length === 0)
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
                operating_system: {
                    osName: attributes.os_name && `${attributes.os_name} ${attributes.os_major}.${attributes.os_minor}`
                        || 'No data',
                    rhsmVersion: attributes.rhsm_version
                },
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

export const createCvesRows = (rows) => {
    if (rows.length !== 0) {
        return rows.map(cve => {
            const { attributes, id } = cve;
            const severityObject = advisorySeverities.filter(severity => severity.label === attributes.impact)[0];

            return {
                id,
                key: id,
                cells: [
                    { title: (
                        <Button variant="link" component="a" href={`/insights/vulnerability/cves/${attributes.synopsis}`} >
                            {attributes.synopsis}
                        </Button>) },
                    {
                        title: (<TextContent>
                            <TextListItem component={TextListItemVariants.dd}>
                                <SecurityIcon size="sm" color={severityObject.color}/>  {severityObject.label}
                            </TextListItem>
                        </TextContent>),
                        value: severityObject.label
                    },
                    { title: parseFloat(attributes.cvss_score).toFixed(1) }
                ]
            };
        });
    } else {
        return [
            {
                heightAuto: true,
                cells: [
                    {
                        props: { colSpan: 4 },
                        title: <EmptyCvesList />
                    }
                ]
            }
        ];
    }
};
