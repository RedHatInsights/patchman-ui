import React, { lazy, Suspense, Fragment } from 'react';
import some from 'lodash/some';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import { fetchSystems } from './Utilities/api';

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

    React.useEffect(() => {
        const systems = fetchSystems();
        systems.then((res) => {
            if (res.meta.total_items === 0) {
                props.childProps.history.replace(paths.register.to);
            }
        });
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

                <InsightsRoute
                    exact
                    path={paths.register.to}
                    component={RegisterPage}
                    rootClass="Patchman"
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
