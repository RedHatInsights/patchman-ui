import PropTypes from 'prop-types';
import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import WithPermission from './PresentationalComponents/WithPermission/WithPermission';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useFeatureFlag } from './Utilities/Hooks';
import { featureFlags } from './Utilities/constants';
import some from 'lodash/some';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import axios from 'axios';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

const PermissionRouter = (route, index) => {
    const {
        component: Component,
        isExact,
        path,
        props = {},
        requiredPermissions
    } = route;
    const routeProps = {
        isExact,
        path
    };

    const componentProps = {
        ...props,
        route: { ...route }
    };

    return (
        <Route {...routeProps} key={index}>
            <WithPermission requiredPermissions={requiredPermissions}>
                <Component {...componentProps} />
            </WithPermission>
        </Route>
    );
};

PermissionRouter.propTypes = {
    component: PropTypes.node,
    isExact: PropTypes.bool,
    path: PropTypes.string,
    props: PropTypes.object
};

const Advisories = lazy(() =>
    import(
        /* webpackChunkName: "Advisories" */ './SmartComponents/Advisories/Advisories'
    )
);

const Systems = lazy(() =>
    import(
        /* webpackChunkName: "Systems" */ './SmartComponents/Systems/Systems'
    )
);

const InventoryDetail = lazy(() =>
    import(
        /* webpackChunkName: "InventoryDetail" */ './SmartComponents/SystemDetail/InventoryDetail'
    )
);

const AdvisoryPage = lazy(() =>
    import(
        /* webpackChunkName: "AdvisoryPage" */ './SmartComponents/AdvisoryDetail/AdvisoryDetail'
    )
);

const PackagesPage = lazy(() =>
    import(
        /* webpackChunkName: "Packages" */ './SmartComponents/Packages/Packages'
    )
);

const PackageDetail = lazy(() =>
    import(
        /* webpackChunkName: "PackageDetail" */ './SmartComponents/PackageDetail/PackageDetail'
    )
);

const Templates = lazy(() =>
    import(
        /* webpackChunkName: "Templates" */ './SmartComponents/PatchSet/PatchSet'
    )
);

const TemplateDetail = lazy(() =>
    import(
        /* webpackChunkName: "TemplateDetail" */ './SmartComponents/PatchSetDetail/PatchSetDetail'
    )
);

export const Routes = () => {
    const history = useHistory();
    const chrome = useChrome();

    const isPatchSetEnabled = useFeatureFlag(featureFlags.patch_set, chrome);
    const generalPermissions = ['patch:*:*', 'patch:*:read'];
    const [hasSystems, setHasSystems] = useState(true);
    const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';

    const paths = [
        {
            path: '/advisories/:advisoryId/:inventoryId',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: InventoryDetail
        },
        {
            path: '/advisories/:advisoryId',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: AdvisoryPage
        },
        {
            path: '/advisories',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: Advisories
        },
        {
            path: '/systems/:inventoryId',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: InventoryDetail
        },
        {
            path: '/systems',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: Systems
        },
        {
            path: '/packages/:packageName/:inventoryId',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: InventoryDetail
        },
        {
            path: '/packages/:packageName',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: PackageDetail
        },
        {
            path: '/packages',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: PackagesPage
        },
        ...(isPatchSetEnabled ? [{
            path: '/templates/:templateName',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: TemplateDetail
        },
        {
            path: '/templates',
            isExact: true,
            requiredPermissions: generalPermissions,
            component: Templates
        }] : [])
    ];

    const listenNavigation = useCallback(() => {
        if (chrome) {
            return chrome.on('APP_NAVIGATION', event => {
                if (event.domEvent) {
                    history.push(`/${event.navId}`);
                }
            });
        }
    }, []);

    useEffect(() => {
        const unregister = listenNavigation();
        return () => unregister();
    }, []);

    useEffect(() => {
        try {
            axios
            .get(`${INVENTORY_TOTAL_FETCH_URL}?page=1&per_page=1`)
            .then(({ data }) => {
                setHasSystems(data.total > 0);
            });
        } catch (e) {
            console.log(e);
        }
    }, [hasSystems]);

    return (
        <Suspense
            fallback={
                <Bullseye>
                    <Spinner />
                </Bullseye>
            }
        >
            {!hasSystems ? (
                <AsyncComponent
                    appId="content_management_zero_state"
                    appName="dashboard"
                    module="./AppZeroState"
                    scope="dashboard"
                    ErrorComponent={<div>Error state</div>}
                    app="Content_management"
                />)
                :
                <Switch>
                    {paths.map(PermissionRouter)}
                    <Redirect
                        from='/advisories/:advisoryId/:inventoryId'
                        to='/systems/:inventoryId'
                    />
                    <Redirect
                        from='/packages/:packageName/:inventoryId'
                        to='/systems/:inventoryId'
                    />
                    <Route render={() =>
                        (
                            (!isPatchSetEnabled || !some(paths, p => p.to === history.location.pathname)) && (
                                <Redirect to={'/advisories'} />
                            )
                        )
                    }
                    />
                </Switch>
            }
        </Suspense>
    );
};
