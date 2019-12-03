import { Main } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdvisoriesTable from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTable';
import { advisoriesColumns } from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTableAssets';
import Header from '../../PresentationalComponents/Header/Header';
import {
    expandAdvisoryRow,
    fetchApplicableAdvisories,
    selectAdvisoryRow
} from '../../store/Actions/Actions';
import { createAdvisoriesRows } from '../../Utilities/DataMappers';
import {
    getRowIdByIndexExpandable,
    useMountDispatch
} from '../../Utilities/Helpers';

const onCollapse = (dispatch, rowState) => {
    dispatch(expandAdvisoryRow(rowState));
};

const onSelect = (dispatch, rowState) => {
    dispatch(selectAdvisoryRow(rowState));
};

const Advisories = () => {
    const dispatch = useDispatch();
    useMountDispatch(fetchApplicableAdvisories);
    const advisories = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.rows
    );
    const expandedRows = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.expandedRows
    );
    const selectedRows = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.selectedRows
    );
    const rows = React.useMemo(
        () => createAdvisoriesRows(advisories, expandedRows, selectedRows),
        [advisories, expandedRows, selectedRows]
    );

    return (
        <React.Fragment>
            <Header title={'Advisories'} showTabs />
            <Main>
                <AdvisoriesTable
                    columns={advisoriesColumns}
                    rows={rows}
                    onCollapse={(_, rowId, value) =>
                        onCollapse(dispatch, {
                            rowId: getRowIdByIndexExpandable(advisories, rowId),
                            value
                        })
                    }
                    onSelect={(_, value, rowId) =>
                        onSelect(dispatch, {
                            rowId: getRowIdByIndexExpandable(advisories, rowId),
                            value
                        })
                    }
                />
            </Main>
        </React.Fragment>
    );
};

export default Advisories;
