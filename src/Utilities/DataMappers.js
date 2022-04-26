import { TextContent, TextListItem, TextListItemVariants } from '@patternfly/react-core';
import { SecurityIcon } from '@patternfly/react-icons';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { flatMap } from 'lodash';
import React from 'react';
import messages from '../Messages';
import AdvisoryType from '../PresentationalComponents/AdvisoryType/AdvisoryType';
import { DescriptionWithLink } from '../PresentationalComponents/Snippets/DescriptionWithLink';
import { EmptyAdvisoryList, EmptyCvesList, EmptyPackagesList,
    EmptyPatchSetList, NoPatchSetList, EmptySystemsList } from '../PresentationalComponents/Snippets/EmptyStates';
import { SystemUpToDate } from '../PresentationalComponents/Snippets/SystemUpToDate';
import { advisorySeverities, entityTypes } from './constants';
import { createUpgradableColumn, handleLongSynopsis, handlePatchLink } from './Helpers';
import { intl } from './IntlProvider';

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
                        {
                            title: handleLongSynopsis(row.attributes.synopsis)
                        },
                        {
                            title: (
                                <AdvisoryType
                                    type={row.attributes.advisory_type_name}
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
                        {
                            title: row.attributes.reboot_required &&
                                intl.formatMessage(messages.labelsRebootRequired)
                                || intl.formatMessage(messages.labelsRebootNotRequired)
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
                        {
                            title: handleLongSynopsis(row.attributes.synopsis)
                        },
                        {
                            title: (
                                <AdvisoryType
                                    type={row.attributes.advisory_type_name}
                                />
                            )
                        },
                        {
                            title: row.attributes.reboot_required &&
                                intl.formatMessage(messages.labelsRebootRequired)
                                || intl.formatMessage(messages.labelsRebootNotRequired)
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
        rows.map(({ id, ...rest }) => {
            const {
                packages_installed: installedPckg,
                packages_updatable: updatablePckg,
                rhba_count: rhba,
                rhsa_count: rhsa,
                rhea_count: rhea,
                os_name: osName,
                os_major: osMajor,
                os_minor: osMinor,
                other_count: other,
                rhsm,
                tags
            } = rest;
            return {
                id,
                ...rest,
                key: Math.random().toString() + id,
                packages_installed: installedPckg,
                disableCheckbox: updatablePckg === 0 || [installedPckg, rhba, rhsa, rhea].every(count => count === 0),
                applicable_advisories: [
                    rhea || 0,
                    rhba || 0,
                    rhsa || 0,
                    other || 0
                ],
                operating_system: {
                    osName: osName && `${rest.os_name} ${osMajor}.${osMinor}`
                        || 'N/A',
                    rhsm
                },
                selected: selectedRows[id] !== undefined,
                tags
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
                display_name: row.display_name,
                installed_evra: row.installed_evra,
                available_evra: row.updatable && row.available_evra || row.installed_evra,
                disableCheckbox: !row.updatable,
                updatable: row.updatable,
                upgradable: row.updatable,
                selected: selectedRows[row.id] !== undefined,
                tags: row.tags
            };
        });
    return data || [];
};

export const createSystemPackagesRows = (rows, selectedRows = {}) => {
    if (rows && rows.length !== 0) {
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
    if (rows && rows.length !== 0) {
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
                    {
                        title: (
                            <a href={`${document.baseURI}insights/vulnerability/cves/${attributes.synopsis}`}>
                                {attributes.synopsis}
                            </a>)
                    },
                    {
                        title: (<TextContent>
                            <TextListItem component={TextListItemVariants.dd}>
                                <SecurityIcon size="sm" color={severityObject.color} />  {severityObject.label}
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

export const createSystemsRowsReview = (rows, selectedRows) => {
    if (rows.length !== 0) {
        return rows.map(system => {
            const { attributes, id } = system;

            return {
                id,
                key: id,
                selected: selectedRows[system.id] !== undefined,
                cells: [
                    {
                        title: attributes.display_name
                    },
                    {
                        title: attributes.os
                    },
                    {
                        title: attributes.baseline_name
                    }
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
                        title: <EmptySystemsList />
                    }
                ]
            }
        ];
    }
};

export const createPatchSetRows = (rows, selectedRows = {}, filters) => {

    const data =
        rows &&
        rows.map(row => {
            return {
                id: row.id,
                key: row.id,
                selected: selectedRows[row.id] !== undefined,
                cells: [
                    { title: row.name },
                    { title: row.systems }
                ]
            };
        });

    return data.length > 0 && data ||
        [
            {
                heightAuto: true,
                cells: [
                    {
                        props: { colSpan: 6 },
                        title: (filters.seach || Object.keys(filters.filter).length)
                            && <EmptyPatchSetList/>
                            || <NoPatchSetList/>
                    }
                ]
            }
        ];
};
