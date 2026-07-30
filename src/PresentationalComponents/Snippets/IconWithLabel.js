import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@patternfly/react-core';

/**
 * Display an icon with label.
 * @param {ReactNode} props.icon - The gap between the icon and the lable.
 * @param {string} props.size - The size of the icon (default: 'sm').
 * @param {string} props.label - The label to show with the icon.
 * @note This implementation ensures that text is never wrapped right after the icon, at least one word will stay on the same line.
 */
const IconWithLabel = ({ icon, size = 'sm', label, ...iconProps }) => (
  <p>
    <span className='pf-v6-u-text-nowrap'>
      <Icon className='pf-v6-u-mr-sm' size={size} {...iconProps}>
        {icon}
      </Icon>
    </span>
    {label}
  </p>
);

IconWithLabel.propTypes = {
  icon: PropTypes.object,
  size: PropTypes.string,
  label: PropTypes.string,
};

export default IconWithLabel;
