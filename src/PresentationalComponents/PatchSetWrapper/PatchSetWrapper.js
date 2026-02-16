import React from 'react';
import propTypes from 'prop-types';

import PatchSetWizard from '../../SmartComponents/PatchSetWizard/PatchSetWizard';
import UnassignSystemsModal from '../../SmartComponents/Modals/UnassignSystemsModal';

const PatchSetWrapper = ({ patchSetState, setPatchSetState, totalItems }) => (
  <>
    {patchSetState.isUnassignSystemsModalOpen && (
      <UnassignSystemsModal
        unassignSystemsModalState={patchSetState}
        setUnassignSystemsModalOpen={setPatchSetState}
        totalItems={totalItems}
      />
    )}
    {patchSetState.isPatchSetWizardOpen && <PatchSetWizard setBaselineState={setPatchSetState} />}
  </>
);

PatchSetWrapper.propTypes = {
  patchSetState: propTypes.object,
  setPatchSetState: propTypes.func,
  totalItems: propTypes.number,
};
export default PatchSetWrapper;
