/* eslint-disable */
import toJson from 'enzyme-to-json';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';

const withLink = Component => {
    return mount(<Router>{Component}</Router>);
};
describe('Header component', () => {
    it('should render with header as empty string', () => {
        const header = { title: '' };
        const wrapper = withLink(<Header {...header} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.unmount()
    });

    it('should render with header Hello world', () => {
        const header = { title: 'Hello world' };
        const wrapper = withLink(<Header {...header} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.unmount()
    });

    it('should render with empty breadcrumb', () => {
        const header = {
            breadcrumbs: [],
            title: ''
        };
        const wrapper = withLink(<Header {...header} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.unmount()
    });

    it('should render with 1 breadcrumb item and last is active', () => {
        const header = {
            title: '',
            breadcrumbs: [
                {
                    title: 'First item',
                    to: '#',
                    isActive: true
                }
            ]
        };
        const wrapper = withLink(<Header {...header} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.unmount()
    });

    it('should render without to attribute', () => {
        const header = {
            title: '',
            breadcrumbs: [
                {
                    title: 'First item',
                    isActive: true
                }
            ]
        };
        const wrapper = withLink(<Header {...header} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.unmount()
    });

    it('should render with 2 breadcrumb items and last is active', () => {
        const header = {
            title: '',
            breadcrumbs: [
                {
                    title: 'First item',
                    to: '#',
                    isActive: false
                },
                {
                    title: 'Second item',
                    to: '#',
                    isActive: true
                }
            ]
        };
        const wrapper = withLink(<Header {...header} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.unmount()
    });

    it('should render with 3 breadcrumb items and last is active', () => {
        const header = {
            showTabs: false,
            title: '',
            breadcrumbs: [
                {
                    title: 'First item',
                    to: '#',
                    isActive: false
                },
                {
                    title: 'Second item',
                    to: '#',
                    isActive: false
                },
                {
                    title: 'Third item',
                    to: '#',
                    isActive: true
                }
            ]
        };
        const wrapper = withLink(<Header {...header} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.unmount()
    });

    it('should render with tabs only, click a tab', () => {
        const wrapper = withLink(<Header showTabs title="Title" />);
        let history = wrapper.find('Router').props().navigator;
        const spy = jest.spyOn(history, 'push');
        wrapper
            .find('Tabs.patchman-tabs')
            .props()
            .onSelect();

        expect(spy).toBeCalled();
        wrapper.unmount()
    });
});
/* eslint-enable */
