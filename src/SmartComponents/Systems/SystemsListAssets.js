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
            <Text className="pf-u-font-size-sm">
                Managed by Satellite
            </Text>
        </TextContent>
    </Tooltip>
);

export const systemsListColumns = () => [
    {
        key: 'operating_system',
        title: 'OS',
        renderFunc: value => createOSColumn(value),
        props: {
            width: 5
        }
    },
    {
        key: 'baseline_name',
        title: 'Template',
        renderFunc: (value, _, row) =>
            row.satellite_managed
                ? <ManagedBySatelliteCell />
                : value
                    ? <InsightsLink to={{ pathname: `/templates/${row.baseline_id}` }}>{value}</InsightsLink>
                    : 'No template',
        props: {
            width: 5
        }
    },
    {
        key: 'applicable_advisories',
        title: 'Installable advisories',
        props: {
            width: 15
        },
        renderFunc: value => createAdvisoriesIcons(value, 'installable')
    },
    {
        key: 'packages_installed',
        title: 'Installed packages',
        renderFunc: (packageCount, systemID) => createPackagesColumn(packageCount, systemID),
        props: {
            width: 10
        }
    }
];

export const advisorySystemsColumns = () => [
    {
        key: 'os',
        title: 'OS',
        renderFunc: value => createOSColumn(value),
        props: {
            width: 5
        }
    },
    {
        key: 'baseline_name',
        title: 'Template',
        renderFunc: (value, _, row) =>
            row.satellite_managed
                ? <ManagedBySatelliteCell />
                : value
                    ? <InsightsLink to={{ pathname: `/templates/${row.baseline_id}` }}>{value}</InsightsLink>
                    : 'No template',
        props: {
            width: 5
        }
    },
    {
        key: 'status',
        title: 'Status',
        props: {
            width: 5,
            isStatic: true
        },
        transforms: [sortable]
    }
];

export const packageSystemsColumns = [
    {
        key: 'display_name',
        title: 'Name',
        composed: ['facts.os_release', 'display_name'],
        props: {
            width: 40
        }
    },
    {
        key: 'tags',
        title: 'Tags',
        props: { width: 10, isStatic: true }
    },
    {
        key: 'os',
        title: 'OS',
        renderFunc: value => createOSColumn(value),
        props: {
            width: 5
        }
    },
    {
        key: 'baseline_name',
        title: 'Template',
        renderFunc: (value, _, row) =>
            row.satellite_managed
                ? <ManagedBySatelliteCell />
                : value
                    ? <InsightsLink to={{ pathname: `/templates/${row.baseline_id}` }}>{value}</InsightsLink>
                    : 'No template',
        props: {
            width: 5
        }
    },
    {
        key: 'installed_evra',
        title: 'Installed version',
        props: {
            width: 15
        }
    },
    {
        key: 'available_evra',
        title: 'Latest version',
        props: {
            width: 15
        }
    },
    {
        key: 'update_status',
        title: 'Status',
        props: {
            width: 20
        },
        renderFunc: value => createUpgradableColumn(value)
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
            (__, pagination) => fetchApplicableSystemAdvisoriesApi({ ...filter, ...pagination }),
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

