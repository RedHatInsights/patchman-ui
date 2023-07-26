import { configure, mount, render, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';

configure({ adapter: new Adapter() });

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
    InventoryTable: jest.fn(() => <div className='testInventroyComponentChild'><div>This is child</div></div>)
}));

jest.mock('@redhat-cloud-services/frontend-components/AsyncComponent', () => (
    <div>AsyncComponent</div>
));

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
