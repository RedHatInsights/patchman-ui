import React, { useEffect, useState, Fragment } from 'react';
import SystemDetail from './SmartComponents/SystemDetail/SystemDetail';
import { SystemAdvisoryListStore } from './store/Reducers/SystemAdvisoryListStore';
import { SystemPackageListStore } from './store/Reducers/SystemPackageListStore';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Provider } from 'react-redux';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import PropTypes from 'prop-types';
import { useKesselFeatureFlag } from './Utilities/hooks/useFeatureFlag';
import { KESSEL_API_BASE_URL } from './Utilities/constants';

const WrappedSystemDetail = ({ getRegistry, ...props }) => {
  const [Wrapper, setWrapper] = useState();
  const isKesselEnabled = useKesselFeatureFlag();

  useEffect(() => {
    if (getRegistry) {
      getRegistry()?.register?.({ SystemAdvisoryListStore, SystemPackageListStore });
    }

    setWrapper(() => (getRegistry ? Provider : Fragment));
  }, []);

  const content = Wrapper ? (
    <Wrapper {...(getRegistry && { store: getRegistry()?.getStore() })}>
      <SystemDetail {...props} isInventoryApp />
    </Wrapper>
  ) : (
    <Bullseye>
      <Spinner size='xl' />
    </Bullseye>
  );

  if (!isKesselEnabled) {
    return content;
  }

  return (
    <AccessCheck.Provider
      baseUrl={window.location.origin}
      apiPath={KESSEL_API_BASE_URL}
    >
      {content}
    </AccessCheck.Provider>
  );
};

WrappedSystemDetail.propTypes = {
  getRegistry: PropTypes.func,
};

export { SystemPackageListStore, SystemAdvisoryListStore };

export default WrappedSystemDetail;
