import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { advisoryTypes, TYPE_OTHER } from '../../Utilities/constants';
import IconWithLabel from '../Snippets/IconWithLabel';

const AdvisoryType = ({ type = TYPE_OTHER, size = 'sm' }) =>
  useMemo(() => {
    const advisoryType =
      advisoryTypes.find((item) => item.value === type) ??
      advisoryTypes.find((item) => item.value === TYPE_OTHER);
    return <IconWithLabel icon={advisoryType.icon} size={size} label={advisoryType.label} />;
  }, [type, size]);

AdvisoryType.propTypes = {
  type: PropTypes.string,
  size: PropTypes.string,
};

export default AdvisoryType;
