import PropTypes from 'prop-types';
import React from 'react';
import { advisoryTypes } from '../../Utilities/constants';
import { Flex, FlexItem } from '@patternfly/react-core';

const AdvisoryType = ({ type }) => {
    const advisoryType =
        advisoryTypes.find(item => item.value === type) || advisoryTypes[3];
    return (
        <React.Fragment>
            <Flex>
                <FlexItem spacer={{ default: 'spacerSm' }}>{advisoryType.icon}</FlexItem>
                <FlexItem spacer={{ default: 'spacerSm' }}>{advisoryType.label}</FlexItem>
            </Flex>
        </React.Fragment>
    );
};

AdvisoryType.propTypes = {
    type: PropTypes.number
};

export default AdvisoryType;
