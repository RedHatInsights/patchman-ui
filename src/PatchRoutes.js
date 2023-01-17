import PropTypes from 'prop-types';
import React, { lazy, Suspense, useCallback, useEffect } from 'react';
import { Redirect, Route, Routes, Switch, useNavigate } from 'react-router-dom';
import WithPermission from './PresentationalComponents/WithPermission/WithPermission';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useFeatureFlag } from './Utilities/Hooks';
import { featureFlags } from './Utilities/constants';
import some from 'lodash/some';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const PermissionRouter = ({ route }) => {
    const {
        component: Component,
        props = {},
        requiredPermissions
    } = route;

    const componentProps = {
        ...props,
        route: { ...route }
    };
    return (
        <WithPermission requiredPermissions={requiredPermissions}>
            <Component {...componentProps} />
        </WithPermission>
    );
};

PermissionRouter.propTypes = {
    route: PropTypes.shape({
        component: PropTypes.object,
        requiredPermissions: PropTypes.array,
        props: PropTypes.any
    })
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
        /* webpackChunkName: "AdvisoryyPage" */ './SmartComponents/AdvisoryDetail/AdvisoryDetail'
    )
);

const PackagsPage = lazy(() =>
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
        /* webpackChunkName: "PackageDetail" */ './SmartComponents/PatchSet/PatchSet'
    )
);

const isPatchSetEnabled = useFeatureFlag(featureFlags.patch_set);

export const paths = [
    {
        path: '/advisories/:advisoryId/:inventoryId',
        isExact: true,
        requiredPermissions: ['patch:*:read'],
        component: InventoryDetail
    },
    {
        path: '/advisories/:advisoryId',
        isExact: true,
        requiredPermissions: ['patch:*:read'],
        component: AdvisoryPage
    },
    {
        path: 'advisories*',
        isExact: true,
        requiredPermissions: ['patch:*:read'],
        component: Advisories
    },
    {
        path: '/systems/:inventoryId',
        isExact: true,
        requiredPermissions: ['patch:*:read'],
        component: InventoryDetail
    },
    {
        path: '/systems',
        isExact: true,
        requiredPermissions: ['patch:*:read'],
        component: Systems
    },
    {
        path: '/packages/:packageName/:inventoryId',
        isExact: true,
        requiredPermissions: ['patch:*:read'],
        component: InventoryDetail
    },
    {
        path: '/packages/:packageName',
        isExact: true,
        requiredPermissions: ['patch:*:read'],
        component: PackageDetail
    },
    {
        path: '/packages',
        isExact: true,
        requiredPermissions: ['patch:*:read'],
        component: PackagsPage
    },
    ...(isPatchSetEnabled ? [{
        path: '/templates',
        isExact: true,
        requiredPermissions: ['patch:*:read'],
        component: Templates
    }] : [])

];

export const PatchRoutes = () => {
    const navigate = useNavigate();
    const chrome = useChrome();
    const listenNavigation = useCallback(() => {
        return chrome.on('APP_NAVIGATION', event => {
            if (event.domEvent) {
                navigate(`/${event.navId}`);
            }
        });
    }, []);

    useEffect(() => {
        const unregister = listenNavigation();
        return () => unregister();
    }, []);

    return (
        <Suspense
            fallback={
                <Bullseye>
                    <Spinner />
                </Bullseye>
            }
        >
            <Routes>
                {paths.map((route, index) =>
                    <Route path={route.path} key={index} element={<PermissionRouter route={route}/>}/>
                    //TODO: ADD ALLL REMAINING ROUTES!!!
                )
                }
            </Routes>
        </Suspense>
    );
};
