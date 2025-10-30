import React, { Fragment, useState, memo, useEffect } from 'react';
import propTypes from 'prop-types';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import WizardMapper from '@data-driven-forms/pf4-component-mapper/wizard';
import TextField from '@data-driven-forms/pf4-component-mapper/text-field';
import DatePicker from '@data-driven-forms/pf4-component-mapper/date-picker';

import { Wizard, Modal } from '@patternfly/react-core/deprecated';
import { useDispatch } from 'react-redux';

import ConfigurationStepFields from './steps/ConfigurationStepFields';
import ContentStep from './steps/ContentStep';
import NameField from './InputFields/NameField';
import ToDateField from './InputFields/ToDateField';
import DescriptionField from './InputFields/DescriptionField';
import ReviewSystems from './steps/ReviewSystems';
import ReviewPatchSet from './steps/ReviewPatchSet';
import { schema, validatorMapper, getWizardTitle } from './WizardAssets';
import RequestProgress from './steps/RequestProgress';
import { usePatchSetApi } from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { fetchPatchSetAction, clearPatchSetAction } from '../../store/Actions/Actions';

export const PatchSetWizard = ({ systemsIDs, setBaselineState, patchSetID }) => {
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

    return () => dispatch(clearPatchSetAction());
  }, []);

  const onSubmit = usePatchSetApi(wizardState, setWizardState, patchSetID);

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

  const mapperExtensions = {
    nameField: {
      component: NameField,
    },
    descriptionField: {
      component: DescriptionField,
    },
    toDateField: {
      component: ToDateField,
    },
    contentStep: {
      component: ContentStep,
      patchSetID,
    },
    configurationStep: {
      component: ConfigurationStepFields,
      patchSetID,
    },
    reviewSystems: {
      component: ReviewSystems,
      systemsIDs: systemsIDs || [],
      patchSetID,
    },
    reviewPatchSet: {
      component: ReviewPatchSet,
      systemsIDs: systemsIDs || [],
    },
  };

  return (
    <Fragment>
      {(!wizardState.submitted && (
        <FormRenderer
          schema={schema(wizardType)}
          subscription={{ values: true }}
          FormTemplate={(props) => <Pf4FormTemplate {...props} showFormControls={false} />}
          componentMapper={{
            [componentTypes.WIZARD]: {
              component: WizardMapper,
              className: 'patch-set',
              'data-ouia-component-id': 'patch-set-wizard',
            },
            [componentTypes.TEXT_FIELD]: TextField,
            [componentTypes.DATE_PICKER]: DatePicker,
            ...mapperExtensions,
          }}
          validatorMapper={validatorMapper}
          onSubmit={onSubmit}
          onCancel={handleWizardClose}
        />
      )) || (
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
      )}
    </Fragment>
  );
};

PatchSetWizard.propTypes = {
  setBaselineState: propTypes.func,
  systemsIDs: propTypes.array,
  patchSetID: propTypes.string,
};

export default memo(
  PatchSetWizard,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
