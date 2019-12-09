import { classNames, expandable, sortable } from '@patternfly/react-table';

export const advisoriesColumns = [
    {
        title: 'Name',
        cellFormatters: [expandable],
        transforms: [sortable, classNames('col-width-10')],
        key: 'name'
    },
    {
        title: 'Publish date',
        transforms: [sortable, classNames('col-width-10')],
        key: 'public_date'
    },
    {
        title: 'Type',
        transforms: [sortable, classNames('col-width-10')],
        key: 'type'
    },
    {
        title: 'Applicable Systems',
        transforms: [sortable, classNames('col-width-10')],
        key: 'applicable_systems'
    },
    {
        title: 'Synopsis',
        transforms: [sortable, classNames('col-width-10')],
        key: 'synopsis'
    }
];
