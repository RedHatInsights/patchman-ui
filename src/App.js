import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import './App.scss';
import { paths, Routes } from './Routes';
import { changeTags, changeWorkloads, changeSids, globalFilter } from './store/Actions/Actions';
import { mapGlobalFilters } from './Utilities/Helpers';

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
        history.listen((newLocation) => {
            const { pathname } = newLocation;
            const currentRoute = Object.values(paths).filter(element => pathname !== '/' && pathname.includes(element.to));

            if (pathname === '/') {
                insights.chrome.appNavClick({ id: 'advisories' }, false);
            }
            else if (currentRoute) {
                const navId =  pathname.split('/').filter(element => element.length > 0)[0];
                navId && insights.chrome.appNavClick({ id: navId });
            }
        });
    }, [location.pathname]);

    useEffect(() => {
        insights.chrome.init();
        insights.chrome.identifyApp('patch');

        if (insights.chrome?.globalFilterScope) {
            insights.chrome.on('GLOBAL_FILTER_UPDATE', ({ data }) => {
                const SIDs = insights.chrome?.mapGlobalFilter?.(data, false, true)[1];
                const SAP = data?.Workloads?.SAP;
                const TAGs = insights.chrome?.mapGlobalFilter?.(data)
                ?.filter(item => !item.includes('Workloads'));

                const globalFilterConfig = mapGlobalFilters(TAGs, SIDs, SAP);

                if (!isEqual(config, globalFilterConfig)) {
                    dispatch(globalFilter(globalFilterConfig));
                    setConfig(globalFilterConfig);
                    changeTags(TAGs);
                    changeWorkloads(SAP);
                    changeSids(SIDs);
                }

            });
        }

        const unregister = listenNavigation();
        return () => unregister();
    }, []);

    return (
        <React.Fragment>
            <NotificationPortal />
            <Routes childProps={{ location, history }} />
        </React.Fragment>
    );
};

export default withRouter(App);
