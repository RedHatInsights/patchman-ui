import { expandable, sortable } from '@patternfly/react-table';

export const advisoriesColumns = [
    {
        title: 'Name',
        cellFormatters: [expandable],
        transforms: [sortable],
        key: 'name'
    },
    {
        title: 'Publish date',
        transforms: [sortable],
        key: 'public_date'
    },
    {
        title: 'Type',
        transforms: [sortable],
        key: 'type'
    },
    {
        title: 'Applicable Systems',
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
        key: 'name'
    },
    {
        title: 'Publish date',
        transforms: [sortable],
        key: 'public_date'
    },
    {
        title: 'Type',
        transforms: [sortable],
        key: 'type'
    },
    {
        title: 'Synopsis',
        transforms: [sortable],
        key: 'synopsis'
    }
];
