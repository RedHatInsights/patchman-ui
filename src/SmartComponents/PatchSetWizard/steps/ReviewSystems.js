import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import searchFilter from '../../../PresentationalComponents/Filters/SearchFilter';
import { Text, TextContent, Stack, StackItem, TextVariants, Alert } from '@patternfly/react-core';
import { useSelector, shallowEqual } from 'react-redux';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

import { createSortBy, buildSelectedSystemsObj } from '../../../Utilities/Helpers';
import { createSystemsRowsReview } from '../../../Utilities/DataMappers';
import { usePerPageSelect, useSetPage, useSortColumn, useOnSelect, ID_API_ENDPOINTS } from '../../../Utilities/hooks';
import TableView from '../../../PresentationalComponents/TableView/TableView';
import staleFilter from '../../../PresentationalComponents/Filters/SystemStaleFilter';
import systemsUpdatableFilter from '../../../PresentationalComponents/Filters/SystemsUpdatableFilter';
import { fetchSystems } from '../../../Utilities/api';
import { reviewSystemColumns } from '../WizardAssets';
import messages from '../../../Messages';
import { intl } from '../../../Utilities/IntlProvider';
import { systemsListDefaultFilters } from '../../../Utilities/constants';
import useOsVersionFilter from '../../../PresentationalComponents/Filters/OsVersionFilter';

export const ReviewSystems = ({ systemsIDs = [], ...props }) => {
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const { values } = formOptions.getState();
    const defaultSelectedSystems = buildSelectedSystemsObj(systemsIDs, values?.systems);

    const [isLoading, setLoading] = useState(true);
    const [rawData, setRawData] = useState([]);
    const [systems, setSystems] = useState([]);
    const [selectedRows, setSelectedRows] = useState(defaultSelectedSystems);
    const [metadata, setMetada] = useState({
        limit: 20,
        offset: 0,
        total_items: 0
    });

    const [queryParams, setQueryParams] = useState({
        page: 1,
        perPage: 20,
        filter: {
            stale: [true, false]
        }
    });

    const { assignedSystems } = useSelector(({ SpecificPatchSetReducer }) => SpecificPatchSetReducer, shallowEqual);

    useEffect(() => {
        fetchSystems({
            ...queryParams,
            filter: {
                ...queryParams.filter,
                id: systemsIDs.length > 0 ? `in:${systemsIDs.join(',')}` : undefined,
                satellite_managed: false
            }
        }).then(result => {
            setSystems(
                createSystemsRowsReview(
                    result.data,
                    { ...buildSelectedSystemsObj([...assignedSystems, ...systemsIDs]), ...selectedRows }
                )
            );
            setMetada(result.meta);
            setRawData(result.data);
            setLoading(false);
        });
    }, [queryParams.filter, queryParams]);

    useEffect(() => {
        input.onChange(selectedRows);

        setSystems(
            createSystemsRowsReview(rawData, selectedRows)
        );
    }, [selectedRows]);

    useEffect(() => {
        setSelectedRows({ ...selectedRows, ...buildSelectedSystemsObj(assignedSystems) });
    }, [assignedSystems]);

    const apply = (params, shouldReset = true) => {
        setLoading(true);
        setQueryParams((prevQueryParams) => ({
            ...prevQueryParams,
            ...params,
            filter: { ...prevQueryParams.filter, ...params.filter },
            ...shouldReset && {
                page: 1,
                offset: 0
            }
        }));
    };

    const osFilterConfig = useOsVersionFilter(queryParams.filter.os, apply);
    const onSort = useSortColumn(reviewSystemColumns, apply, 1);
    const sortBy = React.useMemo(
        () => createSortBy(reviewSystemColumns, metadata.sort, 1),
        [metadata.sort]
    );

    const onSetPage = useSetPage(metadata.limit, params => apply(params, false));

    const onPerPageSelect = usePerPageSelect(apply);

    const selectRows = (toSelect) => {
        const newSelections = toSelect.reduce((object, system) => {
            object[system.id] = system.selected ? true : undefined;
            return object;
        }, {});

        setSelectedRows({ ...selectedRows, ...newSelections });
    };

    const onSelect = useOnSelect(
        systems,
        selectedRows,
        {
            endpoint: ID_API_ENDPOINTS.systems,
            queryParams: {
                ...queryParams,
                filter: {
                    ...queryParams.filter,
                    ...systemsIDs.length > 0 && { id: `in:${systemsIDs.join(',')}` },
                    satellite_managed: false
                }
            },
            customSelector: selectRows,
            totalItems: metadata.total_items
        }
    );
    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text component="h2">
                        {intl.formatMessage(messages.templateApplySystems)}
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <TextContent>
                    <Text component={TextVariants.p}>
                        Select systems to apply the new template to. The list of systems <b>does not contain</b> systems
                        managed by Satellite.
                    </Text>
                </TextContent>
            </StackItem>
            <Alert variant="warning" title={intl.formatMessage(messages.templateAlertSystems)} isInline />
            <StackItem>
                <TableView
                    columns={reviewSystemColumns}
                    compact
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    onSort={onSort}
                    selectedRows={selectedRows}
                    onSelect={onSelect}
                    sortBy={sortBy}
                    apply={apply}
                    tableOUIA={'patch-set-table'}
                    paginationOUIA={'patch-set-pagination'}
                    store={{ rows: systems, metadata, status: { isLoading }, queryParams }}
                    filterConfig={{
                        items: [
                            searchFilter(apply, queryParams.search,
                                intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
                                intl.formatMessage(messages.labelsFiltersSearch)
                            ),
                            staleFilter(apply, queryParams.filter),
                            systemsUpdatableFilter(apply, queryParams.filter),
                            ...osFilterConfig
                        ]
                    }}
                    searchChipLabel={intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)}
                    defaultFilters={systemsListDefaultFilters}
                />
            </StackItem>
        </Stack>
    );
};

ReviewSystems.propTypes = {
    systemsIDs: propTypes.array
};

export default ReviewSystems;
