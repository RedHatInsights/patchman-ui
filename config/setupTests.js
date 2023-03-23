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
