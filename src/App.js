import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { NotificationsProvider } from '@redhat-cloud-services/frontend-components-notifications';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import { useFlagsStatus } from '@unleash/proxy-client-react';
import { changeGlobalTags, changeProfile, globalFilter } from './store/Actions/Actions';
import { mapGlobalFilters } from './Utilities/Helpers';
import useFeatureFlag from './Utilities/hooks/useFeatureFlag';
import { featureFlags, KESSEL_API_BASE_URL } from './Utilities/constants';
import './App.scss';
import Routes from './Routes';

const App = () => {
  const dispatch = useDispatch();
  const chrome = useChrome();
  const { flagsReady } = useFlagsStatus();
  const isKesselEnabled = useFeatureFlag(featureFlags.kessel_enabled);
  const [config, setConfig] = useState({
    selectedTags: [],
    systemProfile: false,
  });

  useEffect(() => {
    chrome?.globalFilterScope?.('insights');
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      chrome?.enablePackagesDebug();
    }

    if (chrome?.globalFilterScope) {
      chrome?.on('GLOBAL_FILTER_UPDATE', ({ data }) => {
        const TAGs = chrome?.mapGlobalFilter?.(data)?.filter((item) => !item.includes('Workloads'));

        const globalFilterConfig = mapGlobalFilters(TAGs, data?.Workloads);

        if (JSON.stringify(config) !== JSON.stringify(globalFilterConfig)) {
          dispatch(globalFilter(globalFilterConfig));
          setConfig(globalFilterConfig);
          dispatch(changeGlobalTags(globalFilterConfig.selectedTags));
          dispatch(changeProfile(globalFilterConfig.systemProfile));
        }
      });
    }
  }, []);

  const notificationsAndRoutes = (
    <NotificationsProvider>
      <Routes />
    </NotificationsProvider>
  );

  if (!flagsReady) {
    return (
      <Bullseye>
        <Spinner size='xl' />
      </Bullseye>
    );
  }

  return isKesselEnabled ? (
    <AccessCheck.Provider baseUrl={window.location.origin} apiPath={KESSEL_API_BASE_URL}>
      {notificationsAndRoutes}
    </AccessCheck.Provider>
  ) : (
    <RBACProvider appName='patch'>{notificationsAndRoutes}</RBACProvider>
  );
};

export default App;
