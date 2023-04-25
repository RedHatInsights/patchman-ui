import propTypes from 'prop-types';
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import publishDateFilter from '../../PresentationalComponents/Filters/PublishDateFilter';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import typeFilter from '../../PresentationalComponents/Filters/TypeFilter';
import rebootFilter from '../../PresentationalComponents/Filters/RebootFilter';
import advisoryStatusFilter from '../../PresentationalComponents/Filters/AdvisoryStatusFilter';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { systemAdvisoriesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { changeSystemAdvisoryListParams, clearSystemAdvisoriesStore, expandSystemAdvisoryRow,
    fetchApplicableSystemAdvisories, selectSystemAdvisoryRow } from '../../store/Actions/Actions';
import { exportSystemAdvisoriesCSV, exportSystemAdvisoriesJSON } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import { createSystemAdvisoriesRows } from '../../Utilities/DataMappers';
import { arrayFromObj, createSortBy, decodeQueryparams,
    getRowIdByIndexExpandable, remediationProvider } from '../../Utilities/Helpers';
import { usePerPageSelect, useSetPage, useSortColumn, useOnExport, usePushUrlParams } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { useOnSelect, ID_API_ENDPOINTS } from '../../Utilities/useOnSelect';

const SystemAdvisories = ({ handleNoSystemData, inventoryId }) => {
    const dispatch = useDispatch();
    const [firstMount, setFirstMount] = useState(true);
    const advisories = useSelector(
        ({ SystemAdvisoryListStore }) => SystemAdvisoryListStore.rows
    );

    const expandedRows = useSelector(
        ({ SystemAdvisoryListStore }) => SystemAdvisoryListStore.expandedRows
    );
    const queryParams = useSelector(
        ({ SystemAdvisoryListStore }) => SystemAdvisoryListStore.queryParams
    );
    const selectedRows = useSelector(
        ({ SystemAdvisoryListStore }) => SystemAdvisoryListStore.selectedRows
    );
    const metadata = useSelector(
        ({ SystemAdvisoryListStore }) => SystemAdvisoryListStore.metadata
    );
    const status = useSelector(
        ({ SystemAdvisoryListStore }) => SystemAdvisoryListStore.status
    );
    const rows = useMemo(
        () =>
            createSystemAdvisoriesRows(advisories, expandedRows, selectedRows, metadata),
        [advisories, expandedRows, selectedRows]
    );

    const [searchParams] = useSearchParams();

    const historyPusher = usePushUrlParams(queryParams);

    useEffect(() => {
        return () => dispatch(clearSystemAdvisoriesStore());
    }, []);

    useEffect(() => {
        if (firstMount) {
            apply(decodeQueryparams('?' + searchParams.toString()));
            setFirstMount(false);
        } else {
            historyPusher();
            dispatch(
                fetchApplicableSystemAdvisories({ id: inventoryId, ...queryParams })
            );
        }
    }, [queryParams]);

    const onCollapse = useCallback((_, rowId, value) =>
        dispatch(
            expandSystemAdvisoryRow({
                rowId: getRowIdByIndexExpandable(advisories, rowId),
                value
            })
        ), [JSON.stringify(advisories)]
    );

    const constructFilename = (advisory) => advisory?.id || advisory;
    const onSelect = useOnSelect(
        rows,
        selectedRows,
        {
            endpoint: ID_API_ENDPOINTS.systemAdvisories(inventoryId),
            queryParams,
            selectionDispatcher: selectSystemAdvisoryRow,
            constructFilename
        }
    );

    const onSort = useSortColumn(systemAdvisoriesColumns, apply, 2);
    const sortBy = React.useMemo(
        () => createSortBy(systemAdvisoriesColumns, metadata.sort, 2),
        [metadata.sort]
    );
    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    function apply(params) {
        dispatch(changeSystemAdvisoryListParams({ id: inventoryId, ...params }));
    }

    const errorState = status.code === 404 ? handleNoSystemData() : <Unavailable/>;

    const onExport = useOnExport(inventoryId, queryParams, {
        csv: exportSystemAdvisoriesCSV,
        json: exportSystemAdvisoriesJSON
    }, dispatch);

    return (
        <React.Fragment>
            <TableView
                columns={systemAdvisoriesColumns}
                compact
                onCollapse={onCollapse}
                onSelect={onSelect}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                onSort={onSort}
                onExport={onExport}
                sortBy={sortBy}
                remediationProvider={() =>
                    remediationProvider(
                        arrayFromObj(selectedRows),
                        inventoryId,
                        remediationIdentifiers.advisory
                    )
                }
                selectedRows={selectedRows}
                systemId={inventoryId}
                apply={apply}
                store={{ rows, metadata, status, queryParams }}
                remediationButtonOUIA={'toolbar-remediation-button'}
                tableOUIA={'system-advisories-table'}
                paginationOUIA={'system-advisories-pagination'}
                filterConfig={{
                    items: [
                        searchFilter(apply, queryParams.search,
                            intl.formatMessage(messages.labelsFiltersSearchAdvisoriesTitle),
                            intl.formatMessage(messages.labelsFiltersSearchAdvisoriesPlaceholder)
                        ),
                        typeFilter(apply, queryParams.filter),
                        publishDateFilter(apply, queryParams.filter),
                        rebootFilter(apply, queryParams.filter),
                        advisoryStatusFilter(apply, queryParams.filter)
                    ]
                }}
                errorState={errorState}
                searchChipLabel={intl.formatMessage(messages.labelsFiltersSearchAdvisoriesTitle)}
            />
        </React.Fragment>
    );
};

SystemAdvisories.propTypes = {
    handleNoSystemData: propTypes.func,
    inventoryId: propTypes.string.isRequired
};
export default SystemAdvisories;
