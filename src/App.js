import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import { changeGlobalTags, changeProfile, globalFilter } from './store/Actions/Actions';
import { mapGlobalFilters } from './Utilities/Helpers';
import './App.scss';
import Routes from './Routes';

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
        const SIDs = chrome?.mapGlobalFilter?.(data, false, true)[1];
        const TAGs = chrome?.mapGlobalFilter?.(data)?.filter((item) => !item.includes('Workloads'));

        const globalFilterConfig = mapGlobalFilters(TAGs, SIDs, data?.Workloads);

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
    <React.Fragment>
      <NotificationPortal />
      <RBACProvider appName='patch'>
        <Routes />
      </RBACProvider>
    </React.Fragment>
  );
};

export default App;
