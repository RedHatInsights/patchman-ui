import React, { Fragment, useState, memo, useEffect } from 'react';
import propTypes from 'prop-types';

import { Wizard, Modal } from '@patternfly/react-core/deprecated';
import { useDispatch } from 'react-redux';

import { getWizardTitle } from './WizardAssets';
import RequestProgress from './steps/RequestProgress';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { fetchPatchSetAction } from '../../store/Actions/Actions';

export const PatchSetWizard = ({ setBaselineState, patchSetID }) => {
  // if system ids exist, those are being assigned. Likewise if patchSetID exists, it is being edited
  const wizardType = patchSetID ? 'edit' : 'create';
  const [wizardState, setWizardState] = useState({
    submitted: false,
    formValues: {},
    requestPending: true,
    failed: false,
    shouldRefresh: false,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    if (patchSetID) {
      dispatch(fetchPatchSetAction(patchSetID));
    }
  }, []);

  const handleWizardClose = () => {
    const shouldRefresh = !wizardState.failed && wizardState.submitted;

    setBaselineState({
      isPatchSetWizardOpen: false,
      systemsIDs: [],
      patchSetID: undefined,
      shouldRefresh,
    });
    setWizardState({ formValues: {}, submitted: false });
  };

  return (
    <Fragment>
      <Modal
        isOpen
        variant='large'
        showClose={false}
        className='patch-set'
        hasNoBodyWrapper
        aria-describedby='patch-set-description'
        aria-labelledby='patch-set-modal-title'
      >
        <Wizard
          className='patch-set'
          title={getWizardTitle(wizardType)}
          description={<Fragment>{intl.formatMessage(messages.templateDescription)}</Fragment>}
          steps={[
            {
              name: 'progress',
              component: <RequestProgress onClose={handleWizardClose} state={wizardState} />,
              isFinishedStep: true,
            },
          ]}
          onClose={handleWizardClose}
        />
      </Modal>
    </Fragment>
  );
};

PatchSetWizard.propTypes = {
  setBaselineState: propTypes.func,
  patchSetID: propTypes.string,
};

export default memo(
  PatchSetWizard,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
