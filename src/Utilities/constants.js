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
export const advisorySeverities = [
    {
        id: 0,
        name: 'N/A',
        color: 'var(--pf-global--Color--200)'
    },
    {
        id: 1,
        name: 'None',
        color: 'var(--pf-global--Color--200)'
    },
    {
        id: 2,
        name: 'Low',
        color: 'var(--pf-global--Color--200)'
    },
    {
        id: 3,
        name: 'Moderate',
        color: 'var(--pf-global--warning-color--100)'
    },
    {
        id: 4,
        name: 'Important',
        color: '#ec7a08'
    },
    {
        id: 5,
        name: 'Critical',
        color: 'var(--pf-global--danger-color--100)'
    }
];
