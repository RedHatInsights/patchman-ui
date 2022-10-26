// import some from 'lodash/some';
import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
// import { useFeatureFlag } from './Utilities/Hooks';
// import { featureFlags } from './Utilities/constants';
import WithPermission from './PresentationalComponents/WithPermission/WithPermission';
import { Bullseye, Spinner } from '@patternfly/react-core';
// import PropTypes from 'prop-types';

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

// viewer = patch*:*
//admin = patch::
export const paths = [
    {
        path: '/advisories',
        isExact: true,
        requiredPermissions: ['patch:*:*'],
        component: Advisories
    },
    {
        path: '/systems/',
        isExact: true,
        requiredPermissions: ['patch:*:*'],
        component: Systems
    },
    {
        path: '/systems/:inventoryId',
        isExact: true,
        requiredPermissions: ['patch:*:*'],
        component: InventoryDetail
    },
    {
        path: '/advisories/:advisoryId',
        isExact: true,
        requiredPermissions: ['patch:*:*'],
        component: AdvisoryPage
    },
    {
        path: '/advisories/:advisoryId/:inventoryId',
        isExact: true,
        requiredPermissions: ['patch:*:*'],
        component: InventoryDetail
    },
    {
        path: '/packages',
        isExact: true,
        requiredPermissions: ['patch:*:*'],
        component: PackagsPage
    },
    {
        path: '/packages/:packageName',
        isExact: true,
        requiredPermissions: ['patch:*:*'],
        component: PackageDetail
    },
    {
        path: '/packages/:packageName/:inventoryId',
        isExact: true,
        requiredPermissions: ['patch:*:*'],
        component: InventoryDetail
    },
    {
        path: '/templates',
        isExact: true,
        requiredPermissions: ['patch:*:*'],
        component: Templates
    }
];

export const Routes = () => {
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
                <Route>
                    <Redirect to="/advisories" />
                </Route>
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
