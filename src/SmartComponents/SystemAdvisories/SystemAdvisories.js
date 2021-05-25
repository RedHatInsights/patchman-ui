import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import publishDateFilter from '../../PresentationalComponents/Filters/PublishDateFilter';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import typeFilter from '../../PresentationalComponents/Filters/TypeFilter';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { systemAdvisoriesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { changeSystemAdvisoryListParams, clearSystemAdvisoriesStore, expandSystemAdvisoryRow,
    fetchApplicableSystemAdvisories, selectSystemAdvisoryRow } from '../../store/Actions/Actions';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import { createSystemAdvisoriesRows } from '../../Utilities/DataMappers';
import { arrayFromObj, createSortBy, decodeQueryparams, encodeURLParams,
    getRowIdByIndexExpandable, remediationProvider } from '../../Utilities/Helpers';
import { usePerPageSelect, useSetPage, useSortColumn, useOnSelect } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const SystemAdvisories = ({ history, handleNoSystemData }) => {
    const dispatch = useDispatch();
    const [firstMount, setFirstMount] = React.useState(true);
    const advisories = useSelector(
        ({ SystemAdvisoryListStore }) => SystemAdvisoryListStore.rows
    );

    const entity = useSelector(({ entityDetails }) => entityDetails.entity);

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
    const error = useSelector(
        ({ SystemAdvisoryListStore }) => SystemAdvisoryListStore.error
    );
    const rows = React.useMemo(
        () =>
            createSystemAdvisoriesRows(advisories, expandedRows, selectedRows, metadata),
        [advisories, expandedRows, selectedRows]
    );

    React.useEffect(() => {
        return () => dispatch(clearSystemAdvisoriesStore());
    }, []);

    React.useEffect(() => {
        if (firstMount) {
            apply(decodeQueryparams(history.location.search));
            setFirstMount(false);
        } else {
            history.push(encodeURLParams(queryParams));
            dispatch(
                fetchApplicableSystemAdvisories({ id: entity.id, ...queryParams })
            );
        }
    }, [queryParams]);

    const onCollapse = React.useCallback((_, rowId, value) =>
        dispatch(
            expandSystemAdvisoryRow({
                rowId: getRowIdByIndexExpandable(advisories, rowId),
                value
            })
        )
    );

    const selectRows = (toSelect) => {
        dispatch(
            selectSystemAdvisoryRow(toSelect)
        );
    };

    const fetchAllData = () =>
        fetchApplicableSystemAdvisoriesApi({ id: entity.id, ...queryParams, limit: -1 });

    const onSelect = useOnSelect(rows, selectedRows, fetchAllData, selectRows, (advisory) => advisory.id);

    const onSort = useSortColumn(systemAdvisoriesColumns, apply, 2);
    const sortBy = React.useMemo(
        () => createSortBy(systemAdvisoriesColumns, metadata.sort, 2),
        [metadata.sort]
    );
    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    function apply(params) {
        dispatch(changeSystemAdvisoryListParams({ id: entity.id, ...params }));
    }

    const errorState = status.code === 404 ? handleNoSystemData() : <Unavailable/>;

    if (status.hasError && status.code !== 404) {
        dispatch(addNotification({
            variant: 'danger',
            title: error.title,
            description: error.detail
        }));}

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
                sortBy={sortBy}
                remediationProvider={() =>
                    remediationProvider(
                        arrayFromObj(selectedRows),
                        entity.id,
                        remediationIdentifiers.advisory
                    )
                }
                selectedRows={selectedRows}
                systemId={entity.id}
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
                        publishDateFilter(apply, queryParams.filter)
                    ]
                }}
                errorState={errorState}
            />
        </React.Fragment>
    );
};

SystemAdvisories.propTypes = {
    history: propTypes.object,
    handleNoSystemData: propTypes.func
};
export default withRouter(SystemAdvisories);
