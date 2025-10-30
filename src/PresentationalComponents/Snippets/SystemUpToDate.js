import { Bullseye, EmptyState, EmptyStateBody, Icon } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const SystemUpToDate = () => (
  <Bullseye>
    <EmptyState
      headingLevel='h5'
      icon={() => (
        <Icon size='xl' style={{ marginBottom: 15 }}>
          <CheckCircleIcon color={'var(--pf-t--global--icon--color--status--success--default)'} />
        </Icon>
      )}
      titleText={intl.formatMessage(messages.statesNoApplicableAdvisories)}
      style={{ paddingTop: 40 }}
    >
      <EmptyStateBody>{intl.formatMessage(messages.statesSystemUpToDate)}</EmptyStateBody>
    </EmptyState>
  </Bullseye>
);
