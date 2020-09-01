import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import publishDateFilter from '../../PresentationalComponents/Filters/PublishDateFilter';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import typeFilter from '../../PresentationalComponents/Filters/TypeFilter';
import Error from '../../PresentationalComponents/Snippets/Error';
import { NoSystemData } from '../../PresentationalComponents/Snippets/NoSystemData';
import { SystemUpToDate } from '../../PresentationalComponents/Snippets/SystemUpToDate';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { systemAdvisoriesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { changeSystemAdvisoryListParams, clearSystemAdvisoriesStore, expandSystemAdvisoryRow,
    fetchApplicableSystemAdvisories, selectSystemAdvisoryRow } from '../../store/Actions/Actions';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { createSystemAdvisoriesRows } from '../../Utilities/DataMappers';
import { arrayFromObj, createSortBy, decodeQueryparams, encodeURLParams,
    getRowIdByIndexExpandable, remediationProvider } from '../../Utilities/Helpers';
import { usePerPageSelect, useSetPage, useSortColumn } from '../../Utilities/Hooks';

const SystemAdvisories = ({ history }) => {
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
            createSystemAdvisoriesRows(advisories, expandedRows, selectedRows),
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

    const onSelect = React.useCallback((event, selected, rowId) => {
        const toSelect = [];
        switch (event) {
            case 'none': {
                Object.keys(selectedRows).forEach(id=>{
                    toSelect.push(
                        {
                            id,
                            selected: false
                        }
                    );
                });
                dispatch(
                    selectSystemAdvisoryRow(toSelect)
                );
                break;
            }

            case 'page': {
                advisories.forEach(({ id })=>{
                    toSelect.push(
                        {
                            id,
                            selected: id
                        }
                    );});
                dispatch(
                    selectSystemAdvisoryRow(toSelect)
                );
                break;
            }

            case 'all': {
                const fetchCallback = ({ data }) => {
                    data.forEach(({ id })=>{
                        toSelect.push(
                            {
                                id,
                                selected: id
                            }
                        );});
                    dispatch(
                        selectSystemAdvisoryRow(toSelect)
                    );
                };

                fetchApplicableSystemAdvisoriesApi({ id: entity.id, limit: 999999 }).then(fetchCallback);

                break;
            }

            default: {
                toSelect.push({
                    id: getRowIdByIndexExpandable(advisories, rowId),
                    selected: selected && getRowIdByIndexExpandable(advisories, rowId)
                });
                dispatch(
                    selectSystemAdvisoryRow(toSelect)
                );
            }}

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
        dispatch(changeSystemAdvisoryListParams({ id: entity.id, ...params }));
    }

    const errorState = error.status === 404 ?  <NoSystemData/> : <Error message={error.detail}/>;

    if (status === STATUS_REJECTED && error.status !== 404) {
        dispatch(addNotification({
            variant: 'danger',
            title: error.title,
            description: error.detail
        }));}

    const MainComponent = () => {
        if (status === STATUS_RESOLVED && metadata.total_items === 0
            && Object.keys(queryParams).length === 0) {
            return <SystemUpToDate/>;
        }
        else {
            return <TableView
                columns={systemAdvisoriesColumns}
                onCollapse={onCollapse}
                onSelect={(advisories.length && onSelect) || undefined}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                onSort={onSort}
                sortBy={sortBy}
                remediationProvider={() =>
                    remediationProvider(arrayFromObj(selectedRows), entity.id)
                }
                selectedRows={selectedRows}
                systemId={entity.id}
                apply={apply}
                store={{ rows, metadata, status, queryParams }}
                filterConfig={{
                    items: [
                        searchFilter(apply, queryParams.search),
                        typeFilter(apply, queryParams.filter),
                        publishDateFilter(apply, queryParams.filter)
                    ]
                }}
            />;
        }
    };

    return (
        <React.Fragment>
            {status === STATUS_REJECTED ? errorState : <MainComponent/>}
        </React.Fragment>
    );
};

SystemAdvisories.propTypes = {
    history: propTypes.object
};
export default withRouter(SystemAdvisories);
