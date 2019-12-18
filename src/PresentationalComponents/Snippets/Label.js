import propTypes from 'prop-types';
import React from 'react';
import './Label.scss';

const Label = ({ children }) => {
    return <span className={'patchman-label'}>{children}</span>;
};

Label.propTypes = {
    children: propTypes.any
};

export default Label;
