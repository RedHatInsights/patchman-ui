import { Icon, Split, SplitItem, Title } from '@patternfly/react-core';
import { SecurityIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const AdvisorySeverityInfo = ({ severity }) => {
  return (
    <Split className='infobox' hasGutter>
      <SplitItem isFilled>
        <Flex flex={{ default: 'column' }}>
          <FlexItem spacer={{ default: 'spacerNone' }}>
            <Title headingLevel='h5'>{intl.formatMessage(messages.labelsColumnsSeverity)}</Title>
          </FlexItem>
          <FlexItem spacer={{ default: 'spacerSm' }}>
            <Flex flex={{ default: 'row' }}>
              <FlexItem>
                <Icon size='md'>
                  <SecurityIcon color={severity.color} />
                </Icon>
              </FlexItem>
              <FlexItem>{severity.label}</FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </SplitItem>
    </Split>
  );
};

AdvisorySeverityInfo.propTypes = {
  severity: propTypes.object,
};

export default AdvisorySeverityInfo;
