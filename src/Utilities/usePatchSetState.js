import { useState } from 'react';
import {
    filterSelectedActiveSystemIDs
} from './Helpers';

/**
* Manages unified state for patch set wizard and unassign modal.
* @param {Object} [selectedRows] selected rows object to be removed.
* @returns {patchSetState, setPatchSetState, openPatchSetAssignWizard, openUnassignSystemsModal, openPatchSetEditModal}
*/
const usePatchSetState = (selectedRows) => {
    const [patchSetState, setPatchSetState] = useState({
        isPatchSetWizardOpen: false,
        isUnassignSystemsModalOpen: false,
        isAssignSystemsModalOpen: false,
        shouldRefresh: false,
        systemsIDs: []
    });

    const openPatchSetAssignWizard = (systemID) => {
        setPatchSetState({
            isPatchSetWizardOpen: true,
            systemsIDs: typeof systemID === 'string' && systemID !== ''
                ? [systemID]
                : filterSelectedActiveSystemIDs(selectedRows),
            shouldRefresh: false
        }
        );
    };

    const openUnassignSystemsModal = (systemsIDs) => {
        setPatchSetState({
            isUnassignSystemsModalOpen: true,
            systemsIDs,
            shouldRefresh: false
        });
    };

    const openAssignSystemsModal = (systemsIDs) => {
        setPatchSetState({
            isAssignSystemsModalOpen: true,
            systemsIDs,
            shouldRefresh: false
        });
    };

    const openPatchSetEditModal = (patchSetID) => {
        setPatchSetState({ isPatchSetWizardOpen: true, patchSetID });
    };

    return {
        patchSetState,
        setPatchSetState,
        openPatchSetAssignWizard,
        openUnassignSystemsModal,
        openAssignSystemsModal,
        openPatchSetEditModal
    };
};

export default usePatchSetState;
