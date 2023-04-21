import React from 'react';
import toJson from 'enzyme-to-json';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import { storeListDefaults } from '../../Utilities/constants';
import { createPatchSetRows } from '../../Utilities/DataMappers';
import patchSets from '../../../cypress/fixtures/api/patchSets.json';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import PatchSet from './PatchSet';
import { NoSatellite } from '../../PresentationalComponents/Snippets/EmptyStates';
import NoRegisteredSystems from '../../PresentationalComponents/Snippets/NoRegisteredSystems';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({ location: { search: 'test-search' }, push: () => {} }))
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
    ...jest.requireActual('@redhat-cloud-services/frontend-components/useChrome'),
    useChrome: jest.fn(() => ({
        auth: {
            getUser: () => new Promise(
                (resolve) => resolve({ entitlements: { 'test-entitelement': true } })
            )
        }
    }))
}));

initMocks();

const mockState = {
    ...storeListDefaults,
    rows: createPatchSetRows(patchSets.data, {}, {}),
    status: { isLoading: false, code: 200, hasError: false },
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 10
    }
};

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({ PatchSetsStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({ PatchSetsStore: state });
};

let store = initStore(mockState);
let wrapper;
beforeEach(() => {
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ PatchSetsStore: mockState });
    });
    wrapper = mount(<Provider store={store}>
        <Router><PatchSet history={{ location: {}, push: () => {} }}/></Router>
    </Provider>);
});

describe('PatchSet', () => {
    it('Should render correctly', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should render "No Satellite" empty state', () => {
        useChrome.mockImplementation(() => ({
            auth: {
                getUser: () => new Promise(
                    (resolve) => resolve({
                        entitlements: {
                            smart_management: { is_entitled: false }
                        }
                    })
                )
            }
        }));

        wrapper.update();

        expect(wrapper.find(NoSatellite)).toHaveLength(1);
    });

    it('Should render account empty state on empty account', () => {
        const emptyAccState = {
            ...mockState,
            metadata: {
                has_systems: false
            }
        };
        useSelector.mockImplementation(callback => {
            return callback({ PatchSetsStore: emptyAccState });
        });
        wrapper = mount(<Provider store={store}>
            <Router><PatchSet history={{ location: {}, push: () => {} }}/></Router>
        </Provider>);

        expect(wrapper.find(NoRegisteredSystems)).toHaveLength(1);
    });
});

