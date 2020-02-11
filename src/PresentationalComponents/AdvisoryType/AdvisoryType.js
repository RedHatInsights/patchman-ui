import PropTypes from 'prop-types';
import React from 'react';
import { advisoryTypes } from '../../Utilities/constants';

const AdvisoryType = ({ type }) => {
    const advisoryType =
        advisoryTypes.find(item => item.value === type) || advisoryTypes[3];
    return (
        <React.Fragment>
            <div className={'icon-with-label'}>
                {advisoryType.icon}
                {advisoryType.label}
            </div>
        </React.Fragment>
    );
};

AdvisoryType.propTypes = {
    type: PropTypes.number
};

export default AdvisoryType;
