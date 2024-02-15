import React, { useEffect, useState } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useSelector, useDispatch } from 'react-redux';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { changeSystemsParams, clearInventoryReducer } from '../../store/Actions/Actions';
import { usePatchSetState } from '../../Utilities/hooks';
import { decodeQueryparams } from '../../Utilities/Helpers';
import { useActivateRemediationModal } from './SystemsListAssets';
import SystemsStatusReport from '../../PresentationalComponents/StatusReports/SystemsStatusReport';
import PatchSetWrapper from '../../PresentationalComponents/PatchSetWrapper/PatchSetWrapper';
import RemediationWizard from '../Remediation/RemediationWizard';
import SystemsTable from './SystemsTable';
import { useSearchParams } from 'react-router-dom';

const SystemsMainContent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const [isRemediationOpen, setRemediationOpen] = useState(false);
    const decodedParams = decodeQueryparams('?' + searchParams.toString());
    const [remediationIssues, setRemediationIssues] = useState([]);

    const selectedRows = useSelector(
        ({ entities }) => entities?.selectedRows || []
    );
    const { hasError, code } = useSelector(
        ({ entities }) => entities?.status || {}
    );
    const metadata = useSelector(
        ({ SystemsStore }) => SystemsStore?.metadata || {}
    );

    const queryParams = useSelector(
        ({ SystemsStore }) => SystemsStore?.queryParams || {}
    );

    const apply = (queryParams) => {
        dispatch(changeSystemsParams(queryParams));
    };

    useEffect(() => {
        apply(decodedParams);
        return () => dispatch(clearInventoryReducer());
    }, []);

    const {
        patchSetState, setPatchSetState, openUnassignSystemsModal, openAssignSystemsModal
    } = usePatchSetState(selectedRows);

    const activateRemediationModal = useActivateRemediationModal(
        setRemediationIssues,
        setRemediationOpen
    );

    if (hasError || metadata?.has_systems === false) {
        return <ErrorHandler code={code} metadata={metadata}/>;
    }

    return (
        <React.Fragment>
            <SystemsStatusReport apply={apply} queryParams={queryParams} />
            <PatchSetWrapper
                patchSetState={patchSetState}
                setPatchSetState={setPatchSetState}
                totalItems={metadata?.total_items}
            />
            {isRemediationOpen &&
                    <RemediationWizard
                        data={remediationIssues}
                        isRemediationOpen
                        setRemediationOpen={setRemediationOpen}
                    />
                    || null
            }
            <Main>
                <SystemsTable
                    apply={apply}
                    patchSetState={patchSetState}
                    openAssignSystemsModal={openAssignSystemsModal}
                    openUnassignSystemsModal={openUnassignSystemsModal}
                    setSearchParams={setSearchParams}
                    activateRemediationModal={activateRemediationModal}
                    decodedParams={decodeQueryparams}
                />
            </Main>
        </React.Fragment>
    );
};

export default SystemsMainContent;
