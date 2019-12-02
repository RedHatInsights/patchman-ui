import { Main } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdvisoriesTable from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTable';
import { advisoriesColumns } from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTableAssets';
import Header from '../../PresentationalComponents/Header/Header';
import {
    expandAdvisoryRow,
    fetchApplicableAdvisories
} from '../../store/Actions/Actions';
import { createAdvisoriesRows } from '../../Utilities/DataMappers';
import { useMountDispatch } from '../../Utilities/Helpers';

const onCollapse = (dispatch, rowState) => {
    dispatch(expandAdvisoryRow(rowState));
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
    const rows = React.useMemo(
        () => createAdvisoriesRows(advisories, expandedRows),
        [advisories, expandedRows]
    );

    return (
        <React.Fragment>
            <Header title={'Advisories'} showTabs />
            <Main>
                <AdvisoriesTable
                    columns={advisoriesColumns}
                    rows={rows}
                    onCollapse={(_, rowId, isOpen) =>
                        onCollapse(dispatch, { rowId, isOpen })
                    }
                />
            </Main>
        </React.Fragment>
    );
};

export default Advisories;
