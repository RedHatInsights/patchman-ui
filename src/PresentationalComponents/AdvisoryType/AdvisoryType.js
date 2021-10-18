import PropTypes from 'prop-types';
import React from 'react';
import { advisoryTypes } from '../../Utilities/constants';
import { Flex, FlexItem } from '@patternfly/react-core';

const AdvisoryType = ({ type }) => {
    const advisoryType =
        advisoryTypes.find(item => item.value === type) || advisoryTypes[3];
    return (
        <Flex flex={{ default: 'inlineFlex' }} style={{ flexWrap: 'nowrap' }}>
            <FlexItem>{advisoryType.icon}</FlexItem>
            <FlexItem isFilled>{advisoryType.label}</FlexItem>
        </Flex>
    );
};

AdvisoryType.propTypes = {
    type: PropTypes.number
};

export default AdvisoryType;
