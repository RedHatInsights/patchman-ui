import React from 'react';
import { Icon, Split, SplitItem } from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { PowerOffIcon } from '@patternfly/react-icons';

const RebootRequired = () => (
  <Split hasGutter>
    <SplitItem>
      <Icon size='md' status='danger'>
        <PowerOffIcon />
      </Icon>
    </SplitItem>
    <SplitItem isFilled>{intl.formatMessage(messages.textRebootIsRequired)}</SplitItem>
  </Split>
);

export default RebootRequired;
