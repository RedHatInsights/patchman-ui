import { Bullseye, Spinner } from '@patternfly/react-core';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { NavigateToSystem } from './Utilities/NavigateToSystem';
import {
  useKesselPermissionCheck,
  useRbacPermissionCheck,
} from './Utilities/hooks/usePermissionCheck';
import PatchPermissionGate from './Utilities/PatchPermissionGate';
import ErrorState from '@redhat-cloud-services/frontend-components/ErrorState';

const PermissionRouteKessel = ({ requiredPermissions = [] }) => {
  const { hasAccess, isLoading } = useKesselPermissionCheck(requiredPermissions);
  if (!isLoading) {
    return hasAccess ? <Outlet /> : <NotAuthorized serviceName='patch' />;
  } else {
    return '';
  }
};

const PermissionRouteRbac = ({ requiredPermissions = [] }) => {
  const { hasAccess, isLoading } = useRbacPermissionCheck(requiredPermissions);
  if (!isLoading) {
    return hasAccess ? <Outlet /> : <NotAuthorized serviceName='patch' />;
  } else {
    return '';
  }
};

const permissionRoutePropTypes = {
  requiredPermissions: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
};

const PermissionRoute = (props) => (
  <PatchPermissionGate
    kessel={<PermissionRouteKessel {...props} />}
    rbac={<PermissionRouteRbac {...props} />}
  />
);

PermissionRouteKessel.propTypes = permissionRoutePropTypes;
PermissionRouteRbac.propTypes = permissionRoutePropTypes;
PermissionRoute.propTypes = permissionRoutePropTypes;

const Advisories = lazy(
  () => import(/* webpackChunkName: "Advisories" */ './SmartComponents/Advisories/Advisories'),
);

const Systems = lazy(
  () => import(/* webpackChunkName: "Systems" */ './SmartComponents/Systems/SystemsPage'),
);

const InventoryDetail = lazy(
  () =>
    import(
      /* webpackChunkName: "InventoryDetail" */ './SmartComponents/SystemDetail/InventoryDetail'
    ),
);

const AdvisoryPage = lazy(
  () =>
    import(
      /* webpackChunkName: "AdvisoryPage" */ './SmartComponents/AdvisoryDetail/AdvisoryDetail'
    ),
);

const PackagesPage = lazy(
  () => import(/* webpackChunkName: "Packages" */ './SmartComponents/Packages/Packages'),
);

const PackageDetail = lazy(
  () =>
    import(/* webpackChunkName: "PackageDetail" */ './SmartComponents/PackageDetail/PackageDetail'),
);

const PatchRoutes = () => {
  const generalPermissions = ['patch:*:*', 'patch:*:read'];
  const [hasSystems, setHasSystems] = useState(true);
  const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';
  const RHEL_ONLY_FILTER = '?filter[system_profile][operating_system][RHEL][version][gte]=0';

  useEffect(() => {
    try {
      axios
        .get(`${INVENTORY_TOTAL_FETCH_URL}${RHEL_ONLY_FILTER}&page=1&per_page=1`)
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
        <Route path='/templates'>
          <Route
            path=''
            element={<Navigate relative='route' to='/insights/content/templates' replace />}
          />
        </Route>
        <Route
          path='*'
          element={
            <AsyncComponent
              appId='content_management_zero_state'
              module='./AppZeroState'
              scope='dashboard'
              ErrorComponent={<ErrorState />}
              app='Content_management'
              customFetchResults={hasSystems}
            >
              <Routes>
                <Route element={<PermissionRoute requiredPermissions={generalPermissions} />}>
                  <Route path='/advisories' element={<Advisories />} />
                  <Route
                    path='/advisories/:advisoryId/:inventoryId'
                    element={<NavigateToSystem />}
                  />
                  <Route path='/advisories/:advisoryId' element={<AdvisoryPage />} />
                  <Route path='/systems' element={<Systems />} />
                  <Route path='/systems/:inventoryId' element={<InventoryDetail />} />
                  <Route path='/packages' element={<PackagesPage />} />
                  <Route path='/packages/:packageName' element={<PackageDetail />} />
                  <Route
                    path='/packages/:packageName/:inventoryId'
                    element={<NavigateToSystem />}
                  />
                  <Route path='*' element={<Navigate to='advisories' />} />
                </Route>
              </Routes>
            </AsyncComponent>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default PatchRoutes;
