import { cellWidth, expandable, sortable } from '@patternfly/react-table';

export const advisoriesColumns = [
    {
        title: 'Name',
        cellFormatters: [expandable],
        transforms: [sortable, cellWidth(15)],
        key: 'id'
    },
    {
        title: 'Publish date',
        transforms: [sortable, cellWidth(15)],
        key: 'public_date'
    },
    {
        title: 'Type',
        transforms: [sortable, cellWidth(15)],
        key: 'advisory_type'
    },
    {
        title: 'Applicable systems',
        transforms: [sortable, cellWidth(15)],
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
