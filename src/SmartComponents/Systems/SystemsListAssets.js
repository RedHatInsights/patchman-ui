import { createAdvisoriesIcons } from '../../Utilities/Helpers';

export const systemsListColumns = [
    {
        key: 'display_name',
        title: 'Name',
        composed: ['facts.os_release', 'display_name'],
        props: {
            width: 40
        }
    },
    {
        key: 'applicable_advisories',
        title: 'Applicable advisories',
        props: {
            width: 30
        },
        renderFunc: value => createAdvisoriesIcons(value)
    },
    {
        key: 'status',
        title: 'Status',
        props: {
            width: 30
        }
    }
];
