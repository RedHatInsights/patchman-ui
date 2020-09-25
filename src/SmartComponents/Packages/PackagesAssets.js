import { sortable } from '@patternfly/react-table/dist/js';

export const packagesColumns = [
    {
        key: 'name',
        title: 'Package',
        transforms: [sortable],
        props: {
            width: 50
        }
    },
    {
        key: 'systems_installed',
        title: 'Applicable systems',
        transforms: [sortable],
        props: {
            width: 10
        }
    },
    {
        key: 'systems_updatable',
        title: 'Systems updatable',
        transforms: [sortable],
        props: {
            width: 10
        }
    },
    {
        key: 'summary',
        title: 'Summary',
        transforms: [sortable],
        props: {
            width: 30
        }
    }
];
