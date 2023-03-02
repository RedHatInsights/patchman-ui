import { sortable } from '@patternfly/react-table/dist/js';

export const patchSetDetailColumns = [
    {
        key: 'display_name',
        title: 'Name',
        transforms: [sortable]
    },
    {
        key: 'operating_system',
        title: 'OS'
    },
    {
        key: 'tags',
        title: 'Tags'
    },
    {
        key: 'last_seen',
        title: 'Last seen'
    }
];
