import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import {
  advisorySeverities,
  SEVERITY_CRITICAL,
  SEVERITY_IMPORTANT,
  SEVERITY_MINOR,
  SEVERITY_MODERATE,
  SEVERITY_NONE,
} from '../../Utilities/constants';
import {
  SeverityCriticalIcon,
  SeverityImportantIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityNoneIcon,
} from '@patternfly/react-icons';
import IconWithLabel from '../Snippets/IconWithLabel';

/**
 * Display advisory severity icon with label.
 * @param {string} props.gap - The gap between the icon and the lable (default: 'gapSm').
 * @param {string} props.size - The size of the icon (default: 'sm').
 * @param {number} props.severity - The numeric value of advisory severity (default: null).
 */
const AdvisorySeverity = ({ size = 'sm', severity = SEVERITY_NONE }) => {
  const severityData = advisorySeverities[severity] ?? advisorySeverities[0];

  return useMemo(() => {
    let SevIcon = SeverityNoneIcon;
    switch (severity) {
      case SEVERITY_MINOR:
        SevIcon = SeverityMinorIcon;
        break;
      case SEVERITY_MODERATE:
        SevIcon = SeverityModerateIcon;
        break;
      case SEVERITY_IMPORTANT:
        SevIcon = SeverityImportantIcon;
        break;
      case SEVERITY_CRITICAL:
        SevIcon = SeverityCriticalIcon;
        break;
    }

    return (
      <IconWithLabel
        icon={<SevIcon color={severityData.color} />}
        size={size}
        label={severityData.label}
      />
    );
  }, [size, severity]);
};

AdvisorySeverity.propTypes = {
  size: PropTypes.string,
  severity: PropTypes.number,
};

export default AdvisorySeverity;
