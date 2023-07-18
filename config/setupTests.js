import { configure, mount, render, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';

configure({ adapter: new Adapter() });

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
    useChrome: () => ({
        isBeta: jest.fn()
    })
}));

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
    __esModule: true,
    default: () => ({
        updateDocumentTitle: jest.fn(),
        appAction: jest.fn(),
        appObjectId: jest.fn(),
        on: jest.fn(),
        isBeta: jest.fn()
    }),
    useChrome: () => ({
        isBeta: jest.fn(),
        chrome: jest.fn(),
        updateDocumentTitle: jest.fn()
    })
}));
