import { Main } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { useSelector } from 'react-redux';
import AdvisoriesTable from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTable';
import { advisoriesColumns } from '../../PresentationalComponents/AdvisoriesTable/AdvisoriesTableAssets';
import Header from '../../PresentationalComponents/Header/Header';
import { fetchApplicableAdvisories } from '../../store/Actions/Actions';
import { createAdvisoriesRows } from '../../Utilities/DataMappers';
import { useMountDispatch } from '../../Utilities/Helpers';

const Advisories = () => {
    useMountDispatch(fetchApplicableAdvisories);
    const advisories = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.rows || []
    );
    const rows = React.useMemo(() => createAdvisoriesRows(advisories), [
        advisories
    ]);

    return (
        <React.Fragment>
            <Header title={'Advisories'} showTabs />
            <Main>
                <AdvisoriesTable columns={advisoriesColumns} rows={rows} />
            </Main>
        </React.Fragment>
    );
};

export default Advisories;
