import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@redhat-cloud-services/frontend-components-notifications';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import { changeGlobalTags, changeProfile, globalFilter } from './store/Actions/Actions';
import { mapGlobalFilters } from './Utilities/Helpers';
import { KESSEL_API_BASE_URL } from './Utilities/constants';
import './App.scss';
import Routes from './Routes';

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();
  const chrome = useChrome();
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

  return (
    <QueryClientProvider client={queryClient}>
      <RBACProvider appName='patch'>
        <AccessCheck.Provider baseUrl={window.location.origin} apiPath={KESSEL_API_BASE_URL}>
          <NotificationsProvider>
            <Routes />
          </NotificationsProvider>
        </AccessCheck.Provider>
      </RBACProvider>
    </QueryClientProvider>
  );
};

export default App;
