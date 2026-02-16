import React from 'react';
import propTypes from 'prop-types';

import PatchSetWizard from '../../SmartComponents/PatchSetWizard/PatchSetWizard';

const PatchSetWrapper = ({ patchSetState, setPatchSetState }) => (
  <>
    {patchSetState.isPatchSetWizardOpen && <PatchSetWizard setBaselineState={setPatchSetState} />}
  </>
);

PatchSetWrapper.propTypes = {
  patchSetState: propTypes.object,
  setPatchSetState: propTypes.func,
};
export default PatchSetWrapper;
