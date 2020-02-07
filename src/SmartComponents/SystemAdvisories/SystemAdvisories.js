import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdvisoriesTable from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTable';
import { systemAdvisoriesColumns } from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTableAssets';
import {
    changeSystemAdvisoryListParams,
    clearSystemAdvisoriesStore,
    expandSystemAdvisoryRow,
    fetchApplicableSystemAdvisories,
    selectSystemAdvisoryRow
} from '../../store/Actions/Actions';
import { createSystemAdvisoriesRows } from '../../Utilities/DataMappers';
import {
    arrayFromObj,
    getRowIdByIndexExpandable,
    remediationProvider
} from '../../Utilities/Helpers';
import {
    usePerPageSelect,
    useSetPage,
    useSortColumn
} from '../../Utilities/Hooks';

const SystemAdvisories = () => {
    const dispatch = useDispatch();
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
        dispatch(
            fetchApplicableSystemAdvisories({ id: entity.id, ...queryParams })
        );
    }, [queryParams]);

    const onCollapse = React.useCallback((_, rowId, value) =>
        dispatch(
            expandSystemAdvisoryRow({
                rowId: getRowIdByIndexExpandable(advisories, rowId),
                value
            })
        )
    );

    const onSelect = React.useCallback((_, value, rowId) =>
        dispatch(
            selectSystemAdvisoryRow({
                rowId: getRowIdByIndexExpandable(advisories, rowId),
                value
            })
        )
    );

    const onSort = useSortColumn(systemAdvisoriesColumns, apply, 2);

    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    function apply(params) {
        dispatch(changeSystemAdvisoryListParams({ id: entity.id, ...params }));
    }

    return (
        <React.Fragment>
            <AdvisoriesTable
                columns={systemAdvisoriesColumns}
                rows={rows}
                metadata={metadata}
                onCollapse={onCollapse}
                onSelect={onSelect}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                onSort={onSort}
                isLoading={isLoading}
                remediationProvider={() =>
                    remediationProvider(arrayFromObj(selectedRows), entity.id)
                }
                selectedRows={selectedRows}
                systemId={entity.id}
                apply={apply}
            />
        </React.Fragment>
    );
};

export default SystemAdvisories;
