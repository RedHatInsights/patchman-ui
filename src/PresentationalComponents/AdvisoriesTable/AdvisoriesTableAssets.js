import { classNames, expandable, sortable } from '@patternfly/react-table';

export const advisoriesColumns = [
    {
        title: 'Name',
        cellFormatters: [expandable],
        transforms: [sortable, classNames('col-width-10')]
    },
    {
        title: 'Publish date',
        transforms: [sortable, classNames('col-width-10')]
    },
    { title: 'Type', transforms: [sortable, classNames('col-width-10')] },
    {
        title: 'Applicable Systems',
        transforms: [sortable, classNames('col-width-10')]
    },
    { title: 'Synopsis', transforms: [sortable, classNames('col-width-10')] }
];
