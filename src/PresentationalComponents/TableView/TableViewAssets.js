import { cellWidth, expandable, sortable } from '@patternfly/react-table/dist/js';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const advisoriesColumns = [
    {
        title: intl.formatMessage(messages.labelsColumnsName),
        cellFormatters: [expandable],
        transforms: [sortable, cellWidth(15)],
        key: 'id'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsPublishDate),
        transforms: [sortable, cellWidth(15)],
        key: 'public_date'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsType),
        transforms: [sortable, cellWidth(15)],
        key: 'advisory_type'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsApplicableSystems),
        transforms: [sortable, cellWidth(15)],
        key: 'applicable_systems'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsSynopsis),
        transforms: [sortable],
        key: 'synopsis'
    }
];

export const systemAdvisoriesColumns = [
    {
        title: intl.formatMessage(messages.labelsColumnsName),
        cellFormatters: [expandable],
        transforms: [sortable, cellWidth(15)],
        key: 'id'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsPublishDate),
        transforms: [sortable, cellWidth(15)],
        key: 'public_date'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsType),
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
        title: intl.formatMessage(messages.labelsColumnsPackage),
        transforms: [sortable, cellWidth(20)],
        key: 'name'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsInstalledVersion),
        transforms: [sortable, cellWidth(15)],
        key: 'evra'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsLatestVersion),
        transforms: [cellWidth(15)],
        key: 'latest_update'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsStatus),
        transforms: [cellWidth(10)],
        key: 'updatable'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsSummary),
        transforms: [sortable, cellWidth(40)],
        key: 'summary'
    }
];

export const packagesColumns = [
    {
        key: 'name',
        title: intl.formatMessage(messages.labelsColumnsPackage),
        transforms: [sortable, cellWidth(25)]
    },
    {
        key: 'systems_installed',
        title: intl.formatMessage(messages.labelsColumnsApplicableSystems),
        transforms: [sortable, cellWidth(15)],
        props: {
            width: 10
        }
    },
    {
        key: 'systems_updatable',
        title: intl.formatMessage(messages.labelsColumnsUpgradable),
        transforms: [sortable, cellWidth(10)],
        props: {
            width: 10
        }
    },
    {
        key: 'summary',
        title: intl.formatMessage(messages.labelsColumnsSummary),
        transforms: [sortable, cellWidth(40)],
        props: {
            width: 30
        }
    }
];
