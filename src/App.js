import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import './App.scss';
import { Routes } from './Routes';
import { changeGlobalTags, changeProfile, globalFilter } from './store/Actions/Actions';
import { mapGlobalFilters } from './Utilities/Helpers';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';

const App = () => {
    const dispatch = useDispatch();
    const [config, setConfig] = useState({
        selectedTags: [],
        systemProfile: false
    });
    const location = useLocation();
    const history = useHistory();

    const listenNavigation = () => {
        return  insights.chrome.on('APP_NAVIGATION', event => {
            if (event.domEvent) {
                history.push(`/${event.navId}`);
            }
        });
    };

    useEffect(() => {
        insights.chrome.init();
        insights.chrome.identifyApp('patch');

        if (insights.chrome?.globalFilterScope) {
            insights.chrome.on('GLOBAL_FILTER_UPDATE', ({ data }) => {
                const SIDs = insights.chrome?.mapGlobalFilter?.(data, false, true)[1];
                const TAGs = insights.chrome?.mapGlobalFilter?.(data)
                ?.filter(item => !item.includes('Workloads'));

                const globalFilterConfig = mapGlobalFilters(TAGs, SIDs, data?.Workloads);

                if (!isEqual(config, globalFilterConfig)) {
                    dispatch(globalFilter(globalFilterConfig));
                    setConfig(globalFilterConfig);
                    dispatch(changeGlobalTags(globalFilterConfig.selectedTags));
                    dispatch(changeProfile(globalFilterConfig.systemProfile));
                }

            });
        }

        const unregister = listenNavigation();
        return () => unregister();
    }, []);

    return (
        <React.Fragment>
            <NotificationPortal />
            <RBACProvider appName="patch">
                <Routes childProps={{ location, history }} />
            </RBACProvider>
        </React.Fragment>
    );
};

export default withRouter(App);
