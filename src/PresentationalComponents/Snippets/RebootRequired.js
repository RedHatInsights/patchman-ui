import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { PowerOffIcon } from '@patternfly/react-icons';
import IconWithLabel from './IconWithLabel';

const RebootRequired = () => (
  <IconWithLabel
    icon={<PowerOffIcon />}
    size='md'
    status='danger'
    label={intl.formatMessage(messages.textRebootIsRequired)}
  />
);

export default RebootRequired;
