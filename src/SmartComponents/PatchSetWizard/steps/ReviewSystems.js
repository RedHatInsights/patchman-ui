import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import searchFilter from '../../../PresentationalComponents/Filters/SearchFilter';
import osVersionFilter from '../../../PresentationalComponents/Filters/OsVersionFilter';
import { Text, TextContent, Stack, StackItem, TextVariants } from '@patternfly/react-core';

import { createSortBy } from '../../../Utilities/Helpers';
import { createSystemsRowsReview } from '../../../Utilities/DataMappers';
import { useOnSelect, usePerPageSelect, useSetPage, useSortColumn } from '../../../Utilities/Hooks';
import TableView from '../../../PresentationalComponents/TableView/TableView';
import { fetchSystems } from '../../../Utilities/api';
import { reviewSystemColumns } from '../WizardAssets';
import messages from '../../../Messages';
import { intl } from '../../../Utilities/IntlProvider';

export const ReviewSystems = ({ systemsIDs, ...props }) => {
    const { input } = useFieldApi(props);
    const [isLoading, setLoading] = useState(true);
    const [rawData, setRawData] = useState([]);
    const [systems, setSystems] = useState([]);
    const [selectedRows, setSelectedRows] = useState(() => {
        const assignedSystemsObject = systemsIDs.reduce((object, system) => {
            object[system] = true;
            return object;
        }, {});

        return assignedSystemsObject;
    });
    const [metadata, setMetada] = useState({
        limit: 20,
        offset: 0,
        total_items: 0
    });

    const [queryParams, setQueryParams] = useState({
        page: 1,
        perPage: 20,
        filter: {}
    });

    useEffect(() => {
        fetchSystems({
            ...queryParams, filter: { ...queryParams.filter, id: `in:${systemsIDs.join(',')}` }
        }).then(result => {
            setSystems(createSystemsRowsReview(result.data, selectedRows));
            setMetada(result.meta);
            setRawData(result.data);
            setLoading(false);
        });
    }, [queryParams.filter, queryParams]);

    useEffect(() => {
        const systemIDs = Object.keys(selectedRows).filter((key) => selectedRows[key]);
        input.onChange(systemIDs);

        setSystems(
            createSystemsRowsReview(rawData, selectedRows)
        );
    }, [selectedRows]);

    const apply = (params) => {
        setLoading(true);
        setQueryParams({ ...queryParams, ...params });
    };

    const onSort = useSortColumn(reviewSystemColumns, apply, 1);
    const sortBy = React.useMemo(
        () => createSortBy(reviewSystemColumns, metadata.sort, 1),
        [metadata.sort]
    );

    const onSetPage = useSetPage(metadata.limit, apply);

    const onPerPageSelect = usePerPageSelect(apply);

    const fetchAllData = () =>
        fetchSystems({ ...queryParams,
            filter: { ...queryParams.filter, id: `in:${systemsIDs.join(',')}` }, limit: -1 });

    const selectRows = (toSelect) => {
        setSelectedRows({ ...selectedRows, [toSelect[0].id]: toSelect[0].selected || undefined });
    };

    const onSelect = useOnSelect(systems, selectedRows, fetchAllData, selectRows, (system) => system.id);

    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent style={{ marginTop: '-15px' }}>
                    <Text component={TextVariants.p}>
                        You will be able to adjust your selection anytime. A system can have only one patch set,
                        therefore if you assign a new Patch set to the system, it will be overwritten.
                    </Text>
                </TextContent>
            </StackItem>
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
                            osVersionFilter(queryParams.filter, apply)
                        ]
                    }}
                    searchChipLabel={intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)}
                />
            </StackItem>
        </Stack>
    );
};

ReviewSystems.propTypes = {
    systemsIDs: propTypes.array
};

export default ReviewSystems;
