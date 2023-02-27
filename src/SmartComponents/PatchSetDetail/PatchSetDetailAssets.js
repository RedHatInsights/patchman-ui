import { sortable } from '@patternfly/react-table/dist/js';

export const patchSetDetailColumns = [
    {
        key: 'name',
        title: 'Name',
        transforms: [sortable]
    },
    {
        key: 'operating_system',
        title: 'OS',
        transforms: [sortable]
    },
    {
        key: 'tags',
        title: 'Tags',
        transforms: [sortable]
    },
    {
        key: 'last_seen',
        title: 'Last seen',
        transforms: [sortable]
    }
];
