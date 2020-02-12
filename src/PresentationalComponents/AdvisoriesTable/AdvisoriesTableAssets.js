import { expandable, sortable } from '@patternfly/react-table';

export const advisoriesColumns = [
    {
        title: 'Name',
        cellFormatters: [expandable],
        transforms: [sortable],
        key: 'id'
    },
    {
        title: 'Publish date',
        transforms: [sortable],
        key: 'public_date'
    },
    {
        title: 'Type',
        transforms: [sortable],
        key: 'advisory_type'
    },
    {
        title: 'Applicable systems',
        transforms: [sortable],
        key: 'applicable_systems'
    },
    {
        title: 'Synopsis',
        transforms: [sortable],
        key: 'synopsis'
    }
];

export const systemAdvisoriesColumns = [
    {
        title: 'Name',
        cellFormatters: [expandable],
        transforms: [sortable],
        key: 'id'
    },
    {
        title: 'Publish date',
        transforms: [sortable],
        key: 'public_date'
    },
    {
        title: 'Type',
        transforms: [sortable],
        key: 'advisory_type'
    },
    {
        title: 'Synopsis',
        transforms: [sortable],
        key: 'synopsis'
    }
];
