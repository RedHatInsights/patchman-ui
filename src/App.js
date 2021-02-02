/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import './App.scss';
import { paths, Routes } from './Routes';
import { globalFilter } from './store/Actions/Actions';
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
        history.listen((location) => {
            const { pathname } = location;
            const currentRoute = Object.values(paths).filter(element => pathname !== '/' && pathname.includes(element.to));

            if (pathname === '/') {
                insights.chrome.appNavClick({ id: 'advisories' }, false);
            }
            else if (currentRoute) {
                const navId =  pathname.split('/').filter(element => element.length > 0)[0];
                navId && insights.chrome.appNavClick({ id: navId });
            }
        });
    }, [location.pathname]);;

    useEffect(() => {
        insights.chrome.init();
        insights.chrome.identifyApp('patch');

        if (insights.chrome?.globalFilterScope) {
            insights.chrome.on('GLOBAL_FILTER_UPDATE', ({ data }) => {
                const [workloads, SID, tags] = insights.chrome?.mapGlobalFilter?.(data, false, true);
                const SAP = data?.Workloads?.SAP;
                const selectedTags = insights.chrome?.mapGlobalFilter?.(data)
                ?.filter(item => !item.includes('Workloads')).map(tag => (`tags=${encodeURIComponent(tag)}`));

                const newconfig = { };
                (SAP && SAP.isSelected)
                    ? (newconfig.systemProfile = `filter[system_profile][sap_system]=${SAP.isSelected}&`)
                    : newconfig.systemProfile = undefined;
                selectedTags && (newconfig.selectedTags = selectedTags);
                if (SID && SID?.length !== 0) {
                    const SID_filter = SID.map(item=> `filter[system_profile][sap_sids][in]=${item}`).join('&') ;
                    newconfig.systemProfile = newconfig.systemProfile?.concat(SID_filter) || SID_filter;
                }

                if (!isEqual(config, newconfig)) {
                    dispatch(globalFilter(newconfig));
                    setConfig(newconfig);
                }

            });
        }

        const unregister = listenNavigation();
        return () => unregister();
    }, []);

    return (
        <React.Fragment>
            <NotificationPortal />
            <Routes childProps={location, history} />
        </React.Fragment>
    );
};

export default withRouter(App);
