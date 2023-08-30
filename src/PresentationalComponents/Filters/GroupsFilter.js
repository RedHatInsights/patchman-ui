/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import { getSystemsGroups } from '../../Utilities/api';

const useGroupsFilter = (currentFilter = '', apply, featureFlag = false) => {
    const [groups, setSystemsGroups] = useState([]);

    useEffect(() => {
        if (featureFlag) {
            getSystemsGroups().then(({ results }) => {
                setSystemsGroups((results || []).map(entry => {
                    const { id, name } = entry;
                    return { label: `${name}`, value: `${id}` };
                }));
            });

        }}, []);
    const currentValue = (currentFilter === '' ? []
        : Array.isArray(currentFilter) ? currentFilter : currentFilter.split(','));

    const filterByGroup = value => {
        apply({ filter: { group_name: value } });
    };

    return {
        label: 'Group',
        value: 'group-host-filter',
        type: 'checkbox',
        filterValues: {
            onChange: (event, value) => {
                filterByGroup(value);
            },
            value: currentValue,
            items: groups.map(({ label }) => ({ label, value: label }))
        }
    };
};

export default useGroupsFilter;
