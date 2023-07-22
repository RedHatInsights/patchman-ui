import { cellWidth, expandable, sortable } from '@patternfly/react-table';
import messages from '../../Messages';
import { intl } from '../../Utilities/IntlProvider';

export const advisoriesColumns = [
    {
        title: intl.formatMessage(messages.labelsColumnsName),
        cellFormatters: [expandable],
        transforms: [sortable, cellWidth(15)],
        key: 'id'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsSynopsis),
        transforms: [sortable],
        key: 'synopsis'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsType),
        transforms: [sortable, cellWidth(10)],
        key: 'advisory_type_name'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsAffectedSystems),
        transforms: [sortable, cellWidth(15)],
        key: 'applicable_systems'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsReboot),
        transforms: [sortable],
        key: 'reboot_required'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsPublishDate),
        transforms: [sortable, cellWidth(15)],
        key: 'public_date'
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
        title: 'Synopsis',
        transforms: [sortable, cellWidth(35)],
        key: 'synopsis'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsStatus),
        transforms: [sortable, cellWidth(10)],
        key: 'status'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsType),
        transforms: [sortable, cellWidth(10)],
        key: 'advisory_type_name'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsReboot),
        transforms: [sortable, cellWidth(10)],
        key: 'reboot_required'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsPublishDate),
        transforms: [sortable, cellWidth(10)],
        key: 'public_date'
    }
];

export const systemPackagesColumns = [
    {
        title: intl.formatMessage(messages.labelsColumnsName),
        transforms: [sortable, cellWidth(20)],
        key: 'name'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsInstalledVersion),
        transforms: [sortable, cellWidth(15)],
        key: 'evra'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsLatestInstallableVersion),
        transforms: [cellWidth(15)],
        key: 'latest_installable_version'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsLatestApplicableVersion),
        transforms: [cellWidth(15)],
        key: 'latest_applicable_version'
    },
    {
        title: intl.formatMessage(messages.labelsColumnsStatus),
        transforms: [sortable, cellWidth(10)],
        key: 'update_status'
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
        title: intl.formatMessage(messages.labelsColumnsName),
        transforms: [sortable, cellWidth(25)]
    },
    {
        key: 'systems_installed',
        title: intl.formatMessage(messages.labelsColumnsInstalledSystems),
        transforms: [sortable, cellWidth(10)],
        props: {
            width: 10
        }
    },
    {
        key: 'systems_applicable',
        title: intl.formatMessage(messages.labelsColumnsApplicableSystems),
        transforms: [sortable, cellWidth(10)],
        props: {
            width: 10
        }
    },
    {
        key: 'systems_installable',
        title: intl.formatMessage(messages.labelsColumnsInstallableSystems),
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

export const cvesTableColumns = [
    {
        title: intl.formatMessage(messages.labelsColumnsCveID),
        transforms: [sortable, cellWidth(40)],
        key: 'synopsis'
    },
    {
        key: 'impact',
        title: intl.formatMessage(messages.labelsColumnsSeverity),
        transforms: [sortable, cellWidth(30)],
        props: {
            width: 30
        }
    },
    {
        key: 'cvss',
        title: intl.formatMessage(messages.labelsColumnsCVSS),
        transforms: [sortable, cellWidth(30)],
        props: {
            width: 30
        }
    }
];
