import some from 'lodash/some';
import PropTypes from 'prop-types';
import React, { Fragment, lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { fetchSystems } from './Utilities/api';
import { ENABLE_PACKAGES } from './Utilities/constants';
import { useSelector } from 'react-redux';

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
        to: '/'
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

type Props = {
    childProps: any
};

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return <Route {...rest} component={Component} />;
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

export const Routes = (props: Props) => {

    const hasAccess = useSelector(
        ({ SharedAppStateStore }) => SharedAppStateStore.hasAccess
    );

    React.useEffect(() => {

        if (hasAccess) {
            const systems = fetchSystems({ limit: 1 });
            systems.then((res) => {
                if (res.meta.total_items === 0) {
                    props.childProps.history.replace(paths.register.to);
                }
            });
        }
    }, []);

    const path = props.childProps.location.pathname;

    return (
        // I recommend discussing with UX some nice loading placeholder
        <Suspense fallback={Fragment}>
            <Switch>
                <Route path="/:url*" exact strict render={() => <Redirect to={`${path}/`}/>}/>
                <Redirect
                    from={paths.advisoryDetailSystem.to}
                    to={paths.inventoryDetail.to}
                />
                <Redirect
                    from={paths.packageDetailSystem.to}
                    to={paths.inventoryDetail.to}
                />
                <InsightsRoute
                    path={paths.inventoryDetail.to}
                    component={InventoryPage}
                />
                <InsightsRoute exact path={paths.systems.to} component={Systems} />
                <InsightsRoute
                    exact
                    path={paths.advisoryDetail.to}
                    component={AdvisoryPage}
                />
                <InsightsRoute
                    exact
                    path={paths.advisories.to}
                    component={Advisories}
                    rootClass="Patchman"
                />
                {ENABLE_PACKAGES &&
                <InsightsRoute
                    exact
                    path={paths.packages.to}
                    component={PackagsPage}
                    rootClass="Patchman"
                />}
                <InsightsRoute
                    exact
                    path={paths.register.to}
                    component={RegisterPage}
                    rootClass="Patchman"
                />
                <InsightsRoute
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
