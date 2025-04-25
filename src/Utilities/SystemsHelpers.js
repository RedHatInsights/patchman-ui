import React from 'react';
import searchFilter from '../PresentationalComponents/Filters/SearchFilter';
import staleFilter from '../PresentationalComponents/Filters/SystemStaleFilter';
import systemsUpdatableFilter from '../PresentationalComponents/Filters/SystemsUpdatableFilter';
import { buildFilterChips, templateDateFormat } from './Helpers';
import { intl } from './IntlProvider';
import messages from '../Messages';
import { defaultCompoundSortValues } from './constants';
import { patchSetDetailColumns } from '../SmartComponents/PatchSetDetail/PatchSetDetailAssets';
import { InsightsLink } from '@redhat-cloud-services/frontend-components/InsightsLink';

export const buildFilterConfig = (search, filter, apply) => {
    return {
        items: [
            searchFilter(
                apply,
                search,
                intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
                intl.formatMessage(
                    messages.labelsFiltersSystemsSearchPlaceholder
                )
            ),
            staleFilter(apply, filter),
            systemsUpdatableFilter(apply, filter)
        ]
    };
};

export const buildTemplateFilterConfig = (search, apply) => ({
    items: [
        searchFilter(
            apply,
            search,
            intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
            intl.formatMessage(
                messages.labelsFiltersSystemsSearchPlaceholder
            )
        )
    ]
});

export const buildActiveFiltersConfig = (filter, search, deleteFilters) => {
    if (filter?.group_name?.length === 0) {
        delete filter.group_name;
    }

    return {
        filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
        onDelete: deleteFilters,
        deleteTitle: intl.formatMessage(messages.labelsFiltersReset)
    };};

export const mergeInventoryColumns = (patchmanColumns, inventoryColumns) =>
    patchmanColumns.map(column => ({
        ...inventoryColumns.find(inventoryColumn => inventoryColumn.key === (column.inventoryKey ?? column.key)),
        ...column
    }));

export const templateSystemsColumnsMerger = (defaultColumns) => {
    let lastSeen = defaultColumns.filter(({ key }) => key === 'updated');
    lastSeen = [{ ...lastSeen[0], key: 'last_upload', sortKey: 'last_upload', renderFunc: value => templateDateFormat(value) }];

    let name = defaultColumns.filter(({ key }) => key === 'display_name');
    let tag = defaultColumns.filter(({ key }) => key === 'tags');

    name = [{
        ...name[0],
        renderFunc: (displayName, id) => <InsightsLink to={`/systems/${id}`}>{displayName}</InsightsLink>
    }];

    return [...name, ...tag, ...patchSetDetailColumns, lastSeen[0]];
};

export const createSystemsSortBy = (orderBy, orderDirection, hasLastUpload) => {
    if (orderBy === 'updated') {
        if (!hasLastUpload) {
            orderBy = 'last_upload';
        } else {
            orderBy = 'os';
        }
    } else if (orderBy === 'group_name') {
        orderBy = 'groups'; // patch API service uses 'groups' instead of 'group_name' sort parameter
    }

    let sort = `${orderDirection === 'ASC' ? '' : '-'}${orderBy}`;

    //if orderBy is for a compound column reset sort value to relative compound sort value
    Object.keys(defaultCompoundSortValues).forEach(col => {
        if (col === orderBy) {
            sort = defaultCompoundSortValues[col][orderDirection.toLowerCase()];
        }
    });

    return sort;
};

export const osParamParser = (paramValue) => {
    return paramValue.replace('in:', '').split(',').reduce((osFilter, os) => {
        const [osName, osVersion] = os.split(' ');
        const [major] = osVersion.split('.');

        return {
            ...osFilter,
            [`${osName}-${major}`]: {
                ...osFilter[`${osName}-${major}`] || {},
                [`${osName}-${major}-${osVersion}`]: true
            }
        };
    }, {});
};
