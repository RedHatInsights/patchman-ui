import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';
import propTypes from 'prop-types';
import React from 'react';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { Spinner } from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const AsyncRemediationButton = ({
  remediationProvider,
  isDisabled,
  isLoading,
  patchNoAdvisoryText,
  hasSelected,
}) => {
  const addNotification = useAddNotification();
  const handleRemediationSuccess = (res) => {
    addNotification(res.getNotification());
  };

  return (
    <AsyncComponent
      scope='remediations'
      module='./RemediationButton'
      fallback={<Spinner size='lg' />}
      dataProvider={remediationProvider}
      onRemediationCreated={handleRemediationSuccess}
      isDisabled={isDisabled}
      buttonProps={{ isLoading }}
      patchNoAdvisoryText={patchNoAdvisoryText}
      hasSelected={hasSelected}
    >
      {intl.formatMessage(messages.labelsRemediate)}
    </AsyncComponent>
  );
};

AsyncRemediationButton.propTypes = {
  remediationProvider: propTypes.func,
  isDisabled: propTypes.bool,
  isLoading: propTypes.bool,
  patchNoAdvisoryText: propTypes.string,
  hasSelected: propTypes.bool,
};

export default AsyncRemediationButton;
