import PropTypes from 'prop-types';
import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import axios from 'axios';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

const PermissionRoute = ({ requiredPermissions = [] }) => {
    const { hasAccess, isLoading } = usePermissionsWithContext(requiredPermissions);
    if (!isLoading) {
        return hasAccess ? <Outlet /> : <NotAuthorized serviceName="patch" />;
    } else {
        return '';
    }
};

PermissionRoute.propTypes = {
    requiredPermissions: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string
    ])
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

export const Router = () => {
    const navigate = useNavigate();
    const chrome = useChrome();

    const generalPermissions = ['patch:*:*', 'patch:*:read'];
    const [hasSystems, setHasSystems] = useState(true);
    const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';

    const listenNavigation = useCallback(() => {
        if (chrome) {
            return chrome.on('APP_NAVIGATION', event => {
                if (event.domEvent) {
                    navigate(`/${event.navId}`);
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
            <Routes>

                {!hasSystems ? (

                    <Route path='*' element={
                        <AsyncComponent
                            appId="content_management_zero_state"
                            appName="dashboard"
                            module="./AppZeroState"
                            scope="dashboard"
                            ErrorComponent={<div>Error state</div>}
                            app="Content_management"
                        />
                    } />
                ) : (
                    <Route element={<PermissionRoute requiredPermissions={generalPermissions} />}>
                        <Route path='/advisories' element={<Advisories />} />
                        <Route path='/advisories/:advisoryId' element={<AdvisoryPage />} />
                        <Route path='/advisories/:advisoryId/:inventoryId' element={<Navigate to="../systems/:inventoryId" />} />
                        <Route path='/systems' element={<Systems />} />
                        <Route path='/systems/:inventoryId' element={<InventoryDetail />} />
                        <Route path='/packages' element={<PackagesPage />} />
                        <Route path='/packages/:packageName' element={<PackageDetail />} />
                        <Route path='/packages/:packageName/:inventoryId' element={<Navigate to="../systems/:inventoryId" />} />
                        <Route path='/templates' element={<Templates />} />
                        <Route path='/templates/:templateName' element={<TemplateDetail />} />
                        <Route path='*' element={<Navigate to="advisories" />} />
                    </Route>
                )}
                {/* <Route path="advisories">
                        <Route index element={<Advisories />} />
                        <Route path=':advisoryId'>
                            <Route index element={<AdvisoryPage />} />
                            <Route path=':inventoryId' element={<Navigate to="" />} />
                        </Route>
                    </Route>
                    <Route path="templates">
                        <Route index element={<Templates />} />
                        <Route path=':templateName' element={<TemplateDetail />} />
                    </Route>
                    <Route path="systems">
                        <Route index element={<Systems />} />
                        <Route path=':inventoryId' element={InventoryDetail} />
                    </Route>
                    <Route path="packages">
                        <Route index element={<PackagesPage />} />
                        <Route path=':packageName'>
                            <Route index element={<PackageDetail />} />
                            <Route path=':inventoryId' element={<InventoryDetail />} />
                        </Route>
                    </Route> */}
            </Routes>
        </Suspense>
    );
};
