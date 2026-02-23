import React from 'react';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
    __esModule: true,
    default: () => ({
        updateDocumentTitle: jest.fn(),
        auth: {
            getUser: () => Promise.resolve({
                identity: {
                    account_number: '0',
                    type: 'User',
                    user: {
                        is_org_admin: true
                    }
                },
                entitlements: {
                    hybrid_cloud: { is_entitled: true },
                    insights: { is_entitled: true },
                    openshift: { is_entitled: true },
                    smart_management: { is_entitled: false }
                }
            })
        },
        appAction: jest.fn(),
        appObjectId: jest.fn(),
        on: jest.fn(),
        getUserPermissions: () => Promise.resolve(['inventory:*:*']),
        isBeta: jest.fn(),
        getApp: () => 'patch',
        getBundle: () => 'insights'
    }),
    useChrome: () => ({
        isBeta: jest.fn(),
        updateDocumentTitle: jest.fn()
    })
}));

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    InventoryTable: jest.fn(() =>
        <div data-testid='inventory-mock-component'>
            Inventory
        </div>
    )
}));

jest.mock(
    '@redhat-cloud-services/frontend-components/AsyncComponent',
    () => ({
        __esModule: true,
        default: (props) => <div {...props}>AsyncComponent</div>
    })
);

jest.mock('../src/Utilities/hooks/useRemediationDataProvider', () => ({
    useRemediationDataProvider: () => () => jest.fn()
}));

jest.mock('../src/Utilities/hooks/useFeatureFlag', () => jest.fn());

jest.mock('../src/Utilities/hooks/usePermissionCheck', () => ({
    __esModule: true,
    default: () => ({ hasAccess: true, isLoading: false }),
    useRbacV1Permissions: () => ({ hasAccess: true, isLoading: false }),
    useKesselPermissions: () => ({ hasAccess: true, isLoading: false }),
    PERMISSION_MAP: {
        'patch:*:read': 'patch_system_view',
        'patch:*:*': 'patch_system_edit',
        'patch:template:write': 'patch_template_edit',
    },
}));

jest.mock('@project-kessel/react-kessel-access-check', () => ({
    AccessCheck: {
        Provider: ({ children }) => <>{children}</>,
    },
    useSelfAccessCheck: () => ({ data: null, loading: false, error: null }),
}));

global.React = React;
