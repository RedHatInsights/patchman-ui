import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AdvisoriesTable from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTable';
import { advisoriesColumns } from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTableAssets';
import Header from '../../PresentationalComponents/Header/Header';
import Error from '../../PresentationalComponents/Snippets/Error';
import { changeAdvisoryListParams, expandAdvisoryRow, fetchApplicableAdvisories } from '../../store/Actions/Actions';
import { STATUS_REJECTED } from '../../Utilities/constants';
import { createAdvisoriesRows } from '../../Utilities/DataMappers';
import { createSortBy, decodeQueryparams, encodeURLParams, getRowIdByIndexExpandable } from '../../Utilities/Helpers';
import { usePerPageSelect, useSetPage, useSortColumn } from '../../Utilities/Hooks';

const Advisories = ({ history }) => {
    const dispatch = useDispatch();
    const [firstMount, setFirstMount] = React.useState(true);
    const advisories = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.rows
    );
    const error = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.error
    );
    const expandedRows = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.expandedRows
    );
    const queryParams = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.queryParams
    );
    const selectedRows = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.selectedRows
    );
    const metadata = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.metadata
    );
    const status = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.status
    );
    const rows = React.useMemo(
        () => createAdvisoriesRows(advisories, expandedRows, selectedRows),
        [advisories, expandedRows, selectedRows]
    );

    React.useEffect(() => {
        if (firstMount) {
            apply(decodeQueryparams(history.location.search));
            setFirstMount(false);
        } else {
            history.push(encodeURLParams(queryParams));
            dispatch(fetchApplicableAdvisories(queryParams));
        }
    }, [queryParams]);

    const onCollapse = React.useCallback((_, rowId, value) =>
        dispatch(
            expandAdvisoryRow({
                rowId: getRowIdByIndexExpandable(advisories, rowId),
                value
            })
        )
    );

    const onSort = useSortColumn(advisoriesColumns, apply, 1);
    const sortBy = React.useMemo(
        () => createSortBy(advisoriesColumns, metadata.sort, 1),
        [metadata.sort]
    );

    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    function apply(params) {
        dispatch(changeAdvisoryListParams(params));
    }

    return (
        <React.Fragment>
            <Header title={'System Patching'} showTabs />
            <Main>
                {status === STATUS_REJECTED ? <Error message={error.detail}/> :
                    <AdvisoriesTable
                        columns={advisoriesColumns}
                        onCollapse={onCollapse}
                        onSetPage={onSetPage}
                        onPerPageSelect={onPerPageSelect}
                        onSort={onSort}
                        sortBy={sortBy}
                        apply={apply}
                        store={{ rows, metadata, status, queryParams }}
                    />}
            </Main>
        </React.Fragment>
    );
};

Advisories.propTypes = {
    history: propTypes.object
};

export default withRouter(Advisories);
