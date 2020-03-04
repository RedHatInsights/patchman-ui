import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AdvisoriesTable from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTable';
import { systemAdvisoriesColumns } from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTableAssets';
import { changeSystemAdvisoryListParams, clearSystemAdvisoriesStore,
    expandSystemAdvisoryRow, fetchApplicableSystemAdvisories, selectSystemAdvisoryRow } from '../../store/Actions/Actions';
import { createSystemAdvisoriesRows } from '../../Utilities/DataMappers';
import { arrayFromObj, createSortBy, decodeQueryparams,
    encodeURLParams, getRowIdByIndexExpandable, remediationProvider } from '../../Utilities/Helpers';
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
    const isLoading = useSelector(
        ({ SystemAdvisoryListStore }) => SystemAdvisoryListStore.isLoading
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

    const onSelect = React.useCallback((event, value, rowId) => {
        const toSelect = [];
        switch (event) {
            case 'none': {
                Object.keys(selectedRows).forEach(id=>{
                    toSelect.push(
                        {
                            rowId: id,
                            value: false
                        }
                    );
                });
                break;
            }

            case 'page': {
                advisories.forEach(({ id })=>{
                    toSelect.push(
                        {
                            rowId: id,
                            value: true
                        }
                    );});
                break;
            }

            default: {
                toSelect.push({
                    rowId: getRowIdByIndexExpandable(advisories, rowId),
                    value
                });
            }}

        dispatch(
            selectSystemAdvisoryRow(toSelect)
        );}
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

    return (
        <React.Fragment>
            <AdvisoriesTable
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
                store={{ rows, metadata, isLoading, queryParams }}
            />
        </React.Fragment>
    );
};

SystemAdvisories.propTypes = {
    history: propTypes.object
};
export default withRouter(SystemAdvisories);
