import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Content, Stack, StackItem } from '@patternfly/react-core';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';
import ConfigurationFields from '../InputFields/ConfigurationFields';

const ConfigurationStepFields = ({ patchSetID }) => {
  const formOptions = useFormApi();

  const { patchSet, status, areTakenTemplateNamesLoading } = useSelector(
    ({ SpecificPatchSetReducer }) => SpecificPatchSetReducer,
    shallowEqual,
  );

  useEffect(() => {
    if (patchSetID) {
      const { name, description } = patchSet;

      formOptions.change('name', name);
      formOptions.change('description', description);
    }
  }, [patchSet]);

  return (
    <Stack hasGutter>
      <StackItem>
        <Content>
          <Content component='h2'>{intl.formatMessage(messages.templateDetailStepTitle)}</Content>
        </Content>
      </StackItem>
      <StackItem>{intl.formatMessage(messages.templateDetailStepText)}</StackItem>
      <StackItem>
        <ConfigurationFields
          isLoading={(patchSetID && status.isLoading) || areTakenTemplateNamesLoading}
        />
      </StackItem>
    </Stack>
  );
};

ConfigurationStepFields.propTypes = {
  patchSetID: propTypes.string,
};
export default ConfigurationStepFields;
