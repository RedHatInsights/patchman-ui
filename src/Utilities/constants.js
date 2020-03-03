import BugIcon from '@patternfly/react-icons/dist/js/icons/bug-icon';
import EnhancementIcon from '@patternfly/react-icons/dist/js/icons/enhancement-icon';
import SecurityIcon from '@patternfly/react-icons/dist/js/icons/security-icon';
import UnknownIcon from '@patternfly/react-icons/dist/js/icons/unknown-icon';
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
    { apiValue: '', label: 'All', value: '' },
    {
        apiValue: `gt:${moment()
        .subtract(7, 'days')
        .toISOString()}`,
        label: 'Last 7 days',
        value: 'last7'
    },
    {
        apiValue: `gt:${moment()
        .subtract(30, 'days')
        .toISOString()}`,
        label: 'Last 30 days',
        value: 'last30'
    },
    {
        apiValue: `gt:${moment()
        .subtract(90, 'days')
        .toISOString()}`,
        label: 'Last 90 days',
        value: 'last90'
    },
    {
        apiValue: `gt:${moment()
        .subtract(1, 'years')
        .toISOString()}`,
        label: 'Last year',
        value: 'lastYear'
    },
    {
        apiValue: `lt:${moment()
        .subtract(1, 'years')
        .toISOString()}`,
        label: 'More than 1 year ago',
        value: 'moreThanYear'
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
        color: 'var(--pf-global--Color--200)',
        text:
            'This rating is given to all other issues that have a security impact. These are the types of vulnerabilities' +
            ' that are believed to require unlikely circumstances to be able to be exploited, or where a successful exploit' +
            ' would give minimal consequences.'
    },
    {
        value: 2,
        label: 'Moderate',
        color: 'var(--pf-global--warning-color--100)',
        text:
            'This rating is given to flaws that may be more difficult to exploit but could still lead to some' +
            ' compromise of the confidentiality, integrity, or availability of resources, under certain circumstances.' +
            ' These are the types of vulnerabilities that could have had a Critical impact or Important impact' +
            ' but are less easily exploited based on a technical evaluation of the flaw, or affect unlikely' +
            ' configurations.'
    },
    {
        value: 3,
        label: 'Important',
        color: '#ec7a08',
        text:
            'This rating is given to flaws that can easily compromise the confidentiality, integrity, or availability' +
            ' of resources. These are the types of vulnerabilities that allow local users to gain privileges, allow' +
            ' unauthenticated remote users to view resources that should otherwise be protected by authentication,' +
            ' allow authenticated remote users to execute arbitrary code, or allow remote users to cause a denial' +
            ' of service.'
    },
    {
        value: 4,
        label: 'Critical',
        color: 'var(--pf-global--danger-color--100)',
        text:
            'This rating is given to flaws that could be easily exploited by a remote unauthenticated attacker' +
            ' and lead to system compromise (arbitrary code execution) without requiring user interaction.' +
            ' These are the types of vulnerabilities that can be exploited by worms. Flaws that require an authenticated' +
            ' remote user, a local user, or an unlikely configuration are not classed as Critical impact.'
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

export const filterCategories = {
    advisory_type: {
        label: 'Advisory type',
        values: advisoryTypes
    },
    public_date: {
        label: 'Public date',
        values: publicDateOptions
    }
};
