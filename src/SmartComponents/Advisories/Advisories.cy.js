import Advisories from './Advisories';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { storeListDefaults } from '../../Utilities/constants';
import { advisoryRows } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';

const mockState = { ...storeListDefaults,
    rows: advisoryRows,
    status: { isLoading: false, code: 200, hasError: false },
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 10
    }
};

before(() => {
    cy.mockWindowChrome();
});

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({  AdvisoryListStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({  AdvisoryListStore: state });
};

const ROOT = 'table[aria-label=rule-table]';

const mountComponent = () => {
    let store = initStore(mockState);
    cy.mount(
        <Provider store={store}>
            <MemoryRouter>
                <Routes>
                    <Route element={<Advisories />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
};

describe('renders correctly', () => {
    beforeEach(() => {
        mountComponent();
    });
    it('The Advisories renders correctly', () => {
        cy.get(ROOT).should('have.length', 1);
    });

});
