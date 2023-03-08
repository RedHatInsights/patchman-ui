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
        key: 'installable_advisories',
        title: 'Installable advisories',
        transforms: [sortable]
    },
    {
        key: 'applicable_advisories',
        title: 'Applicable advisories',
        transforms: [sortable]
    },
    {
        key: 'last_upload',
        title: 'Last seen',
        transforms: [sortable]
    }
];
