import React from 'react';
import propTypes from 'prop-types';

import PatchSetWizard from '../../SmartComponents/PatchSetWizard/PatchSetWizard';
import UnassignSystemsModal from '../../SmartComponents/Modals/UnassignSystemsModal';
import AssignSystemsModal from '../../SmartComponents/Modals/AssignSystemsModal';

const PatchSetWrapper = ({ patchSetState, setPatchSetState, totalItems }) => (
  <>
    {patchSetState.isUnassignSystemsModalOpen && (
      <UnassignSystemsModal
        unassignSystemsModalState={patchSetState}
        setUnassignSystemsModalOpen={setPatchSetState}
        systemsIDs={patchSetState.systemsIDs}
        totalItems={totalItems}
      />
    )}
    <AssignSystemsModal
      patchSetState={patchSetState}
      setPatchSetState={setPatchSetState}
      systemsIDs={patchSetState.systemsIDs}
      totalItems={totalItems}
    />
    {patchSetState.isPatchSetWizardOpen && (
      <PatchSetWizard systemsIDs={patchSetState.systemsIDs} setBaselineState={setPatchSetState} />
    )}
  </>
);

PatchSetWrapper.propTypes = {
  patchSetState: propTypes.object,
  setPatchSetState: propTypes.func,
  totalItems: propTypes.number,
};
export default PatchSetWrapper;
