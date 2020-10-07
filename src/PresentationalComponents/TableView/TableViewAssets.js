import { cellWidth, expandable, sortable } from '@patternfly/react-table/dist/js';

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
        title: 'Synopsis',
        transforms: [sortable],
        key: 'synopsis'
    }
];

export const systemPackagesColumns = [
    {
        title: 'Package',
        transforms: [sortable, cellWidth(20)],
        key: 'name'
    },
    {
        title: 'Installed version',
        transforms: [sortable, cellWidth(15)],
        key: 'evra'
    },
    {
        title: 'Latest version',
        transforms: [cellWidth(15)],
        key: 'latest_update'
    },
    {
        title: 'Status',
        transforms: [cellWidth(10)],
        key: 'updatable'
    },
    {
        title: 'Summary',
        transforms: [sortable, cellWidth(40)],
        key: 'summary'
    }
];

export const packagesColumns = [
    {
        key: 'name',
        title: 'Package',
        transforms: [sortable, cellWidth(25)]
    },
    {
        key: 'systems_installed',
        title: 'Applicable systems',
        transforms: [sortable, cellWidth(15)],
        props: {
            width: 10
        }
    },
    {
        key: 'systems_updatable',
        title: 'Upgradable',
        transforms: [sortable, cellWidth(10)],
        props: {
            width: 10
        }
    },
    {
        key: 'summary',
        title: 'Summary',
        transforms: [sortable, cellWidth(40)],
        props: {
            width: 30
        }
    }
];
