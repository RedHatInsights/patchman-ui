import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import WithPermission from './PresentationalComponents/WithPermission/WithPermission';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useFeatureFlag } from './Utilities/Hooks';
import { featureFlags } from './Utilities/constants';
import some from 'lodash/some';

const PermissionRouter = (route) => {
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
        <Route {...routeProps}>
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
        path: '/advisories',
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

export const Routes = (props) => {
    const path = props.childProps.location.pathname;
    return (
        <Suspense
            fallback={
                <Bullseye>
                    <Spinner />
                </Bullseye>
            }
        >
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
                        (!isPatchSetEnabled || !some(paths, p => p.to === path)) && (
                            <Redirect to={'/advisories'} />
                        )
                    )
                }
                />
            </Switch>
        </Suspense>
    );
};

Routes.propTypes = {
    childProps: PropTypes.shape({
        location: PropTypes.shape({
            pathname: PropTypes.string
        }),
        history: PropTypes.any
    })
};

