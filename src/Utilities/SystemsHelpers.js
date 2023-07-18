import React from 'react';
import searchFilter from '../PresentationalComponents/Filters/SearchFilter';
import staleFilter from '../PresentationalComponents/Filters/SystemStaleFilter';
import systemsUpdatableFilter from '../PresentationalComponents/Filters/SystemsUpdatableFilter';
import { buildFilterChips, templateDateFormat } from './Helpers';
import { intl } from './IntlProvider';
import messages from '../Messages';
import { packageSystemsColumns } from '../SmartComponents/Systems/SystemsListAssets';
import { defaultCompoundSortValues } from './constants';
import { patchSetDetailColumns } from '../SmartComponents/PatchSetDetail/PatchSetDetailAssets';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

export const buildFilterConfig = (search, filter, apply, osFilterConfig) => ({
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
        systemsUpdatableFilter(apply, filter),
        ...osFilterConfig
    ]
});

export const buildTemplateFilterConfig = (search, apply, osFilterConfig) => ({
    items: [
        searchFilter(
            apply,
            search,
            intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
            intl.formatMessage(
                messages.labelsFiltersSystemsSearchPlaceholder
            )
        ),
        ...osFilterConfig
    ]
});

export const buildActiveFiltersConfig = (filter, search, deleteFilters) => ({
    filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
    onDelete: deleteFilters,
    deleteTitle: intl.formatMessage(messages.labelsFiltersReset)
});

export const systemsColumnsMerger = (defaultColumns, additionalColumns) => {
    let lastSeen = defaultColumns.filter(({ key }) => key === 'updated');
    lastSeen = [{ ...lastSeen[0], key: 'last_upload', sortKey: 'last_upload' }];

    const nameColumn = defaultColumns.filter(({ key }) => key === 'display_name');
    const groupColumn = defaultColumns.filter(({ key }) => key === 'groups');
    const tagsColumn = defaultColumns.filter(({ key }) => key === 'tags');

    groupColumn[0]?.renderFunc ? groupColumn[0].renderFunc = (value) =>
        isEmpty(value?.groups) ? (
            'N/A'
        ) : (
            //change this link to a InsightsLink after router upgrade
            <a href={`./insights/inventory/groups/${value?.groups[0].id}`}>
                {
                    value?.groups[0].name // currently, one group at maximum is supported
                }
            </a>
        ) : [];

    return [...nameColumn, ...groupColumn, ...tagsColumn, ...additionalColumns(), lastSeen[0]];
};

export const templateSystemsColumnsMerger = (defaultColumns) => {
    let lastSeen = defaultColumns.filter(({ key }) => key === 'updated');
    lastSeen = [{ ...lastSeen[0], key: 'last_upload', sortKey: 'last_upload', renderFunc: value => templateDateFormat(value) }];

    let name = defaultColumns.filter(({ key }) => key === 'display_name');
    let tag = defaultColumns.filter(({ key }) => key === 'tags');

    name = [{
        ...name[0],
        renderFunc: (displayName, id) => <Link to={{ pathname: `/systems/${id}` }}>{displayName}</Link>
    }];

    return [...name, ...tag, ...patchSetDetailColumns, lastSeen[0]];
};

export const createSystemsSortBy = (orderBy, orderDirection, hasLastUpload) => {
    orderBy = (orderBy === 'updated' && !hasLastUpload) && 'last_upload' ||
        (orderBy === 'updated' && hasLastUpload) && packageSystemsColumns[0].key || orderBy;

    let sort = `${orderDirection === 'ASC' ? '' : '-'}${orderBy}`;

    //if orderBy is for a compound column reset sort value to relative compound sort value
    Object.keys(defaultCompoundSortValues).forEach(col => {
        if (col === orderBy) {
            sort = defaultCompoundSortValues[col][orderDirection.toLowerCase()];
        }
    });

    return sort;
};
