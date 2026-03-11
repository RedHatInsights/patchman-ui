import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Flex, Icon } from '@patternfly/react-core';
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

/**
 * Display advisory severity icon with label.
 * @param {string} props.gap - The gap between the icon and the lable (default: 'gapSm').
 * @param {string} props.size - The size of the icon (default: 'sm').
 * @param {number} props.severity - The numeric value of advisory severity (default: null).
 */
const AdvisorySeverity = ({ gap = 'gapSm', size = 'sm', severity = SEVERITY_NONE }) => {
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
      <Flex gap={{ default: gap }} flexWrap={{ default: 'nowrap' }}>
        <Icon size={size}>
          <SevIcon color={severityData.color} />
        </Icon>
        {severityData.label}
      </Flex>
    );
  }, [gap, size, severity]);
};

AdvisorySeverity.propTypes = {
  gap: PropTypes.string,
  size: PropTypes.string,
  severity: PropTypes.number,
};

export default AdvisorySeverity;
