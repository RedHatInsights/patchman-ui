import some from 'lodash/some';
import PropTypes from 'prop-types';
import React, { Fragment, lazy, Suspense, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { fetchSystems } from './Utilities/api';
import { useHistory } from 'react-router-dom';
import { useFeatureFlag } from './Utilities/Hooks';
import { featureFlags } from './Utilities/constants';

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

const NoAccess = lazy(() =>
    import(
        /* webpackChunkName: "NoAccess" */ './PresentationalComponents/NoAccessPage/NoAccess'
    )
);

const Templates = lazy(() =>
    import(
        /* webpackChunkName: "PackageDetail" */ './SmartComponents/PatchSet/PatchSet'
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
    noaccess: {
        title: '',
        to: '/noaccess'
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
    },
    templates: {
        title: 'Templates',
        to: '/templates'
    }
};

export const Routes = (props) => {
    const [responseCode, setResponseCode] = useState();
    const history = useHistory();

    const redirectToNoAccess = (statusCode) => {
        setResponseCode(statusCode);
        history.replace(paths.noaccess.to);
    };

    React.useEffect(() => {
        const systems = fetchSystems({ limit: 1 });
        systems.then((res) => {
            if (!res.meta) {
                redirectToNoAccess(res.status);
            }

        }).catch(err => redirectToNoAccess(err.status));
    }, []);

    const path = props.childProps.location.pathname;

    const isPatchSetEnabled = useFeatureFlag(featureFlags.patch_set);

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
                    component={InventoryDetail}
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
                    path={paths.noaccess.to}
                    render={() => <NoAccess code={responseCode}/>}
                />
                <Route
                    exact
                    path={paths.packageDetail.to}
                    component={PackageDetail}
                />
                {isPatchSetEnabled && <Route
                    exact
                    path={paths.templates.to}
                    component={Templates}
                />}

                <Route
                    render={() =>
                        (
                            (!isPatchSetEnabled || !some(paths, p => p.to === path)) && (
                                <Redirect to={paths.advisories.to} />
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
