import React from 'react';
import { Flex, FlexItem, Tooltip, Icon as PfIcon } from '@patternfly/react-core';
import propTypes from 'prop-types';

const AdvisoriesIcon = ({ count, tooltipText, Icon }) => (
  <Tooltip content={tooltipText}>
    <Flex flex={{ default: 'inlineFlex' }} style={{ flexWrap: 'nowrap' }}>
      <FlexItem spacer={{ default: 'spacerSm' }}>
        <PfIcon>
          <Icon />
        </PfIcon>
      </FlexItem>
      <FlexItem spacer={{ default: 'spacerSm' }}>{(count && count.toString()) || 0}</FlexItem>
    </Flex>
  </Tooltip>
);

AdvisoriesIcon.propTypes = {
  Icon: propTypes.func,
  count: propTypes.any,
  tooltipText: propTypes.string,
};

export default AdvisoriesIcon;
