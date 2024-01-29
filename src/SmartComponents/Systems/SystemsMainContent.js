import React, { useEffect, useState } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useSelector, useDispatch } from 'react-redux';
import messages from '../../Messages';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { DEFAULT_PATCH_TITLE } from '../../Utilities/constants';
import { changeSystemsParams, clearInventoryReducer } from '../../store/Actions/Actions';
import { usePatchSetState } from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import { decodeQueryparams } from '../../Utilities/Helpers';
import { useActivateRemediationModal } from './SystemsListAssets';
import SystemsStatusReport from '../../PresentationalComponents/StatusReports/SystemsStatusReport';
import PatchSetWrapper from '../../PresentationalComponents/PatchSetWrapper/PatchSetWrapper';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import RemediationWizard from '../Remediation/RemediationWizard';
import SystemsTable from './SystemsTable';
import { useSearchParams } from 'react-router-dom';

const SystemsMainContent = () => {
    const chrome = useChrome();
    useEffect(()=>{
        chrome.updateDocumentTitle(`${intl.formatMessage(messages.titlesSystems)}${DEFAULT_PATCH_TITLE}`);
    }, [chrome, intl]);

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
            <PatchSetWrapper patchSetState={patchSetState} setPatchSetState={setPatchSetState} />
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
