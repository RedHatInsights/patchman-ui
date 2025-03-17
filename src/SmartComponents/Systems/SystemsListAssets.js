import React, { useCallback } from 'react';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    createAdvisoriesIcons, createUpgradableColumn,
    remediationProvider, createOSColumn, createPackagesColumn
} from '../../Utilities/Helpers';
import './SystemsListAssets.scss';
import { sortable } from '@patternfly/react-table';
import { InsightsLink } from '@redhat-cloud-services/frontend-components/InsightsLink';
import { Text, TextContent, Tooltip } from '@patternfly/react-core';
import { useFetchBatched } from '../../Utilities/hooks';

export const ManagedBySatelliteCell = () => (
    <Tooltip content="This system is managed by Satellite and does not use a template.">
        <TextContent>
            <Text className="pf-v5-u-font-size-sm">
                Managed by Satellite
            </Text>
        </TextContent>
    </Tooltip>
);

export const SYSTEMS_LIST_COLUMNS = [
    {
        key: 'display_name',
        title: 'Name',
        renderFunc: (displayName, id) => <InsightsLink to={`/systems/${id}`}>{displayName}</InsightsLink>,
        isShown: true,
        isShownByDefault: true,
        isUntoggleable: true
    },
    {
        key: 'groups',
        title: 'Workspace',
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'tags',
        title: 'Tags',
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'operating_system',
        title: 'OS',
        renderFunc: value => createOSColumn(value),
        props: {
            width: 5
        },
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'template_name',
        title: 'Template',
        renderFunc: (value, _, row) =>
            row.satellite_managed
                ? <ManagedBySatelliteCell />
                : value
                    ? <InsightsLink
                        app="content"
                        to={{ pathname: `/templates/${row.template_uuid}/details` }}
                    >{value}</InsightsLink>
                    : 'No template',
        props: {
            width: 5
        },
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'applicable_advisories',
        title: 'Installable advisories',
        props: {
            width: 15
        },
        renderFunc: value => createAdvisoriesIcons(value, 'installable'),
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'packages_installed',
        title: 'Installed packages',
        renderFunc: (packageCount, systemID) => createPackagesColumn(packageCount, systemID),
        props: {
            width: 10
        },
        isShown: true,
        isShownByDefault: true
    },
    {
        inventoryKey: 'updated',
        key: 'last_upload',
        sortKey: 'last_upload',
        title: 'Last seen',
        isShown: true,
        isShownByDefault: true
    }
];

export const ADVISORY_SYSTEMS_COLUMNS = [
    {
        key: 'display_name',
        title: 'Name',
        renderFunc: (displayName, id) => <InsightsLink to={`/systems/${id}`}>{displayName}</InsightsLink>,
        isShown: true,
        isShownByDefault: true,
        isUntoggleable: true
    },
    {
        key: 'groups',
        title: 'Workspace',
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'tags',
        title: 'Tags',
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'os',
        title: 'OS',
        renderFunc: value => createOSColumn(value),
        props: {
            width: 5
        },
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'template_name',
        title: 'Template',
        renderFunc: (value, _, row) =>
            row.satellite_managed
                ? <ManagedBySatelliteCell />
                : value
                    ? <InsightsLink
                        app="content"
                        to={{ pathname: `/templates/${row.template_uuid}/details` }}
                    >{value}</InsightsLink>
                    : 'No template',
        props: {
            width: 5
        },
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'status',
        title: 'Status',
        props: {
            width: 5,
            isStatic: true
        },
        transforms: [sortable],
        isShown: true,
        isShownByDefault: true
    },
    {
        inventoryKey: 'updated',
        key: 'last_upload',
        sortKey: 'last_upload',
        title: 'Last seen',
        isShown: true,
        isShownByDefault: true
    }
];

export const PACKAGE_SYSTEMS_COLUMNS = [
    {
        key: 'display_name',
        title: 'Name',
        isShown: true,
        isShownByDefault: true,
        isUntoggleable: true
    },
    {
        key: 'tags',
        title: 'Tags',
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'os',
        title: 'OS',
        renderFunc: value => createOSColumn(value),
        props: {
            width: 5
        },
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'template_name',
        title: 'Template',
        renderFunc: (value, _, row) =>
            row.satellite_managed
                ? <ManagedBySatelliteCell />
                : value
                    ? <InsightsLink
                        app="content"
                        to={{ pathname: `/templates/${row.template_uuid}/details` }}
                    >{value}</InsightsLink>
                    : 'No template',
        props: {
            width: 5
        },
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'installed_evra',
        title: 'Installed version',
        props: {
            width: 15
        },
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'available_evra',
        title: 'Latest version',
        props: {
            width: 15
        },
        isShown: true,
        isShownByDefault: true
    },
    {
        key: 'update_status',
        title: 'Status',
        props: {
            width: 20
        },
        renderFunc: value => createUpgradableColumn(value),
        isShown: true,
        isShownByDefault: true
    }
];

const isRemediationDisabled = (row) => {
    const { status } = row?.attributes || {};
    const { applicable_advisories: applicableAdvisories } = row || {};

    return (applicableAdvisories && applicableAdvisories.every(typeSum => typeSum === 0)) || (status === 'Applicable');
};

const isPatchSetRemovalDisabled = (row) => {
    const { baseline_name: baselineName } = row || {};
    return !baselineName || (typeof baselineName === 'string' && baselineName === '');
};

export const useActivateRemediationModal = (setRemediationIssues, setRemediationOpen) => {
    const { fetchBatched } = useFetchBatched();

    return useCallback(async (rowData) => {
        const filter = {
            id: rowData.id,
            'filter[status]': 'in:Installable'
        };

        const totalCount = await fetchApplicableSystemAdvisoriesApi({ ...filter, limit: 1 }).then(
            (response) => response?.meta?.total_items || 0
        );

        fetchBatched(
            (filterWithPagination) => fetchApplicableSystemAdvisoriesApi(filterWithPagination),
            filter,
            totalCount
        ).then(response => {
            const advisories = response.flatMap(({ data }) => data);
            const remediationIssues = remediationProvider(
                advisories.map(item => item.id),
                rowData.id,
                remediationIdentifiers.advisory
            );

            setRemediationIssues(remediationIssues);

            setRemediationOpen(true);
        })
        .catch(() => {
            setRemediationOpen(false);
        });
    }, []);

};

export const systemsRowActions = (
    activateRemediationModal,
    showTemplateAssignSystemsModal,
    openUnassignSystemsModal,
    row,
    hasTemplateAccess
) => {
    return [
        {
            title: 'Apply all applicable advisories',
            isDisabled: isRemediationDisabled(row),
            onClick: (event, rowId, rowData) => {
                activateRemediationModal(rowData);
            }
        },
        ...(showTemplateAssignSystemsModal ? [{
            title: 'Assign to a template',
            isDisabled: !hasTemplateAccess || row.satellite_managed,
            onClick: (event, rowId, rowData) => {
                showTemplateAssignSystemsModal({ [rowData.id]: true });
            }
        },
        {
            title: 'Remove from a template',
            isDisabled: !hasTemplateAccess || isPatchSetRemovalDisabled(row) || row.satellite_managed,
            onClick: (event, rowId, rowData) => {
                openUnassignSystemsModal([rowData.id]);
            }
        }
        ] : [])
    ];
};

