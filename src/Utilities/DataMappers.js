import { TextContent, TextListItem, TextListItemVariants } from '@patternfly/react-core';
import { SecurityIcon } from '@patternfly/react-icons';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { flatMap } from 'lodash';
import React from 'react';
import messages from '../Messages';
import AdvisoryType from '../PresentationalComponents/AdvisoryType/AdvisoryType';
import { DescriptionWithLink } from '../PresentationalComponents/Snippets/DescriptionWithLink';
import {
    EmptyAdvisoryList, EmptyCvesList, EmptyPackagesList,
    EmptyPatchSetList, EmptySystemsList
} from '../PresentationalComponents/Snippets/EmptyStates';
import { SystemUpToDate } from '../PresentationalComponents/Snippets/SystemUpToDate';
import { advisorySeverities, entityTypes } from './constants';
import { createUpgradableColumn, handleLongSynopsis, handlePatchLink } from './Helpers';
import { intl } from './IntlProvider';
import { InsightsLink } from '@redhat-cloud-services/frontend-components/InsightsLink';
import { ManagedBySatelliteCell } from '../SmartComponents/Systems/SystemsListAssets';

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
                    parent: index * 2,
                    isExpandedRow: true
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
                    disableSelection: row.attributes.status !== 'Installable',
                    cells: [
                        { title: handlePatchLink(entityTypes.advisories, row.id) },
                        {
                            title: handleLongSynopsis(row.attributes.synopsis)
                        },
                        {
                            title: row.attributes.status
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
                    parent: index * 2,
                    isExpandedRow: true
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
                rhba_count: rhba,
                rhsa_count: rhsa,
                rhea_count: rhea,
                other_count: other,
                os,
                rhsm,
                tags,
                last_upload: lastUpload
            } = rest;
            return {
                id,
                ...rest,
                key: Math.random().toString() + id,
                packages_installed: installedPckg,
                applicable_advisories: [
                    rhea || 0,
                    rhba || 0,
                    rhsa || 0,
                    other || 0
                ],
                operating_system: {
                    osName: os || 'N/A',
                    rhsm
                },
                selected: selectedRows[id] !== undefined,
                tags,
                updated: lastUpload
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
                available_evra: row.updatable ? row.available_evra : row.installed_evra,
                disableSelection: !row.updatable,
                updatable: row.updatable,
                update_status: row.update_status,
                selected: selectedRows[row.id] !== undefined,
                tags: row.tags,
                os: {
                    osName: row.os?.osName || row.os || 'N/A',
                    rhsm: row.rhsm
                },
                baseline_name: row.baseline_name,
                baseline_id: row.baseline_id
            };
        });
    return data || [];
};

export const createAdvisorySystemsRows = (rows, selectedRows = {}) => {
    const data =
        rows.map(({ id, ...rest }) => {
            const {
                packages_installed: installedPckg,
                os,
                rhsm,
                tags,
                last_upload: lastUpload,
                status
            } = rest;
            return {
                id,
                ...rest,
                key: Math.random().toString() + id,
                packages_installed: installedPckg,
                os: {
                    osName: os.osName || os || 'N/A',
                    rhsm
                },
                selected: selectedRows[id] !== undefined,
                tags,
                updated: lastUpload,
                disableSelection: status !== 'Installable'
            };
        });
    return data || [];
};

export const createSystemPackagesRows = (rows, selectedRows = {}) => {
    if (rows && rows.length !== 0) {
        return rows.map(pkg => {
            const pkgNEVRA = `${pkg.name}-${pkg.evra}`;
            const pkgUpdates = pkg.updates || [];
            const latestApplicable = pkgUpdates[pkgUpdates.length - 1];
            const latestInstallable = pkgUpdates.filter(version => version.status === 'Installable').pop();

            return {
                id: pkgNEVRA,
                key: pkgNEVRA,
                selected: selectedRows[pkgNEVRA] !== undefined,
                disableSelection: !pkg.updatable,
                cells: [
                    { title: handlePatchLink(entityTypes.packages, pkg.name) },
                    { title: pkg.evra },
                    { title: latestInstallable?.evra ?? pkg.evra },
                    { title: latestApplicable?.evra ?? pkg.evra },
                    { title: createUpgradableColumn(pkg.update_status) },
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
                    { title: pkg.systems_applicable },
                    { title: pkg.systems_installable },
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
                        title: attributes.os || 'N/A'
                    },
                    {
                        title: attributes.satellite_managed
                            ? <ManagedBySatelliteCell />
                            : attributes.baseline_name || 'No template'
                    },
                    {
                        title: processDate(attributes.last_upload)
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
                displayName: row.name,
                key: row.id,
                selected: selectedRows[row.id] !== undefined,
                cells: [
                    {
                        title: (
                            <InsightsLink to={`/templates/${row.id}`}>
                                {row.name}
                            </InsightsLink>
                        )
                    },
                    { title: row.systems || intl.formatMessage(messages.labelsTemplateNoSystems) },
                    { title: processDate(row.last_edited) },
                    { title: processDate(row.published) },
                    { title: row.creator }
                ]
            };
        });

    return data?.length > 0 ? data :
        (filters.search || Object.keys(filters.filter).length) ?
            [
                {
                    heightAuto: true,
                    cells: [
                        {
                            props: { colSpan: 6 },
                            title: <EmptyPatchSetList />
                        }
                    ]
                }
            ] : [];
};

export const createPatchSetDetailRows = (rows) => {
    const data =
        rows &&
        rows.map(row => {
            row = { ...row, ...row.attributes };

            return {
                ...row,
                id: row.inventory_id,
                display_name: row.display_name,
                key: row.inventory_id,
                os: {
                    osName: row.os || 'N/A',
                    rhsm: row.rhsm
                },
                last_upload: row.last_upload,
                tags: row.tags
            };
        });

    return data;
};
