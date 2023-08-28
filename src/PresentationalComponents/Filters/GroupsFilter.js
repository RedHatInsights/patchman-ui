/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import { getSystemsGroups } from '../../Utilities/api';

const useGroupsFilter = (currentFilter = '', apply) => {
    const [groups, setSystemsGroups] = useState([]);

    useEffect(() => {
        /* explicitly request OS versions from API */
        getSystemsGroups().then(({ results }) => {
            setSystemsGroups((results || []).map(entry => {
                const { id, name } = entry;
                return { label: `${name}`, value: `${id}` };
            }));
        });

    }, []);
    const currentValue = (currentFilter === '' ? [] : Array.isArray(currentFilter) ? currentFilter : currentFilter.split(','));

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
            //TODO: replace with map?
            items: groups.reduce((acc, { label }) => {
                acc.push({ label, value: label });
                return acc;
            }, [])
        }
    };
};

export default useGroupsFilter;
