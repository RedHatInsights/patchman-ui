import some from 'lodash/some';
import PropTypes from 'prop-types';
import React, { Fragment, lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

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

const InventoryPage = lazy(() =>
    import(
        /* webpackChunkName: "InventoryPage" */ './SmartComponents/SystemDetail/InventoryPage'
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

const RegisterPage = lazy(() =>
    import(
        /* webpackChunkName: "Register" */ './PresentationalComponents/RegisterPage/RegisterPage'
    )
);
export const paths = {
    advisories: {
        title: 'Applicable advisories',
        to: '/advisories'
    },
    systems: {
        title: 'Systems',
        to: '/systems/'
    },
    inventoryDetail: {
        title: 'Inventory detail',
        to: '/systems/:inventoryId'
    },
    advisoryDetail: {
        title: 'Advisory detail',
        to: '/advisories/:advisoryId'
    },
    advisoryDetailSystem: {
        title: '',
        to: '/advisories/:advisoryId/:inventoryId'
    },
    register: {
        title: '',
        to: '/register'
    },
    packages: {
        title: 'Packages',
        to: '/packages'
    },
    packageDetail: {
        title: 'Package detail',
        to: '/packages/:packageName'
    },
    packageDetailSystem: {
        title: '',
        to: '/packages/:packageName/:inventoryId'
    }
};

export const Routes = (props) => {

    const path = props.childProps.location.pathname;

    return (
        // I recommend discussing with UX some nice loading placeholder
        <Suspense fallback={Fragment}>
            <Switch>
                <Redirect
                    from={paths.advisoryDetailSystem.to}
                    to={paths.inventoryDetail.to}
                />
                <Redirect
                    from={paths.packageDetailSystem.to}
                    to={paths.inventoryDetail.to}
                />
                <Route
                    path={paths.inventoryDetail.to}
                    component={InventoryPage}
                />
                <Route exact path={paths.systems.to} component={Systems} />
                <Route
                    exact
                    path={paths.advisoryDetail.to}
                    component={AdvisoryPage}
                />
                <Route
                    exact
                    path={paths.advisories.to}
                    component={Advisories}
                />
                <Route
                    exact
                    path={paths.packages.to}
                    component={PackagsPage}
                />
                <Route
                    exact
                    path={paths.register.to}
                    component={RegisterPage}
                />
                <Route
                    exact
                    path={paths.packageDetail.to}
                    component={PackageDetail}
                />

                <Route
                    render={() =>
                        some(paths, p => p.to === path) || (
                            <Redirect to={paths.advisories.to} />
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
