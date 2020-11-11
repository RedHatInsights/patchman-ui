import React from 'react';
import { Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import propTypes from 'prop-types';

const AdvisoriesIcon = ({ count, tooltipText, Icon }) =>(
    <Tooltip content={tooltipText}>
        <Flex flex={{ default: 'inlineFlex' }}>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                <Icon/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                {count.toString()}
            </FlexItem>
        </Flex>
    </Tooltip>
);

AdvisoriesIcon.propTypes = {
    Icon: propTypes.element,
    count: propTypes.any,
    tooltipText: propTypes.string
};

export default AdvisoriesIcon;
