import React from 'react';
import propTypes from 'prop-types';

import PatchSetWizard from '../../SmartComponents/PatchSetWizard/PatchSetWizard';
import UnassignSystemsModal from '../../SmartComponents/Modals/UnassignSystemsModal';
import AssignSystemsModal from '../../SmartComponents/Modals/AssignSystemsModal';

const PatchSetWrapper = ({ patchSetState, setPatchSetState }) => {
    return (<>
        {(patchSetState.isUnassignSystemsModalOpen) && <UnassignSystemsModal
            unassignSystemsModalState={patchSetState}
            setUnassignSystemsModalOpen={setPatchSetState}
            systemsIDs={patchSetState.systemsIDs}
        />}
        <AssignSystemsModal
            patchSetState={patchSetState}
            setPatchSetState={setPatchSetState}
            systemsIDs={patchSetState.systemsIDs}
        />
        {(patchSetState.isPatchSetWizardOpen) &&
        <PatchSetWizard systemsIDs={patchSetState.systemsIDs} setBaselineState={setPatchSetState} />}
    </>);
};

PatchSetWrapper.propTypes = {
    patchSetState: propTypes.object,
    setPatchSetState: propTypes.func
};
export default PatchSetWrapper;
