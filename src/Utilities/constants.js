import {
    BugIcon,
    EnhancementIcon,
    SecurityIcon,
    UnknownIcon
} from '@patternfly/react-icons';
import moment from 'moment';
import React from 'react';

export const storeListDefaults = {
    rows: [],
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 0
    },
    expandedRows: {},
    selectedRows: {},
    queryParams: {}
};

export const publicDateOptions = [
    { value: '', label: 'All' },
    {
        value: `>:${moment()
        .subtract(7, 'days')
        .toISOString()}`,
        label: 'Last 7 days'
    },
    {
        value: `>:${moment()
        .subtract(30, 'days')
        .toISOString()}`,
        label: 'Last 30 days'
    },
    {
        value: `>:${moment()
        .subtract(90, 'days')
        .toISOString()}`,
        label: 'Last 90 days'
    },
    {
        value: `>:${moment()
        .subtract(1, 'years')
        .toISOString()}`,
        label: 'Last year'
    },
    {
        value: `<:${moment()
        .subtract(1, 'years')
        .toISOString()}`,
        label: 'More than 1 year ago'
    }
];

export const advisorySeverities = [
    {
        value: 0,
        label: 'N/A',
        color: 'var(--pf-global--Color--200)'
    },
    {
        value: 1,
        label: 'Low',
        color: 'var(--pf-global--Color--200)'
    },
    {
        value: 2,
        label: 'Moderate',
        color: 'var(--pf-global--warning-color--100)'
    },
    {
        value: 3,
        label: 'Important',
        color: '#ec7a08'
    },
    {
        value: 4,
        label: 'Critical',
        color: 'var(--pf-global--danger-color--100)'
    }
];

export const advisoryTypes = [
    {
        value: 3,
        label: 'Security',
        icon: <SecurityIcon />
    },
    {
        value: 2,
        label: 'Bugfix',
        icon: <BugIcon />
    },
    {
        value: 1,
        label: 'Enhancement',
        icon: <EnhancementIcon />
    },
    {
        value: 0,
        label: 'Unknown',
        icon: <UnknownIcon />
    }
];
