import React from 'react';
import PropTypes from 'prop-types';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useFlagsStatus } from '@unleash/proxy-client-react';
import useFeatureFlag from './hooks/useFeatureFlag';
import { featureFlags } from './constants';

const PatchPermissionGate = ({ kessel, rbac }) => {
  const { flagsReady } = useFlagsStatus();
  const isKesselEnabled = useFeatureFlag(featureFlags.kessel_enabled);

  if (!flagsReady) {
    return (
      <Bullseye>
        <Spinner size='xl' />
      </Bullseye>
    );
  }

  return isKesselEnabled ? kessel : rbac;
};

PatchPermissionGate.propTypes = {
  kessel: PropTypes.node.isRequired,
  rbac: PropTypes.node.isRequired,
};

export default PatchPermissionGate;
